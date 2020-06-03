import JiraConnector from "jira-connector";
import NodeCache from "node-cache";
import moment from "moment";
import _ from "lodash";

import JiraDBController from "./JiraDBController";
import config from "../config/connections";
import { WorklogThumbs, IWorklog, IWorklogWithThumbs } from "../models";

const TTL = 60 * 60; // update every 1 hour
// todo: use session cache for cetain time of one user session to make all data in controller faster.
class JiraAPIController {
  JiraConnection: any;
  JiraDBController: any;
  cache: any;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: TTL,
      checkperiod: TTL * 0.2
    });
    const configObject = {
      ...config.jira_api_connection,
      basic_auth: {
        username: config.customerJiraUsername,
        password: config.customerJiraPassword
      }
    };

    // Using the node module for normal JIRA API calls
    this.JiraConnection = new JiraConnector(configObject);
    // For supporting data which is inefficient to obtain through the API
    this.JiraDBController = new JiraDBController();
  }

  async getAllProjects() {
    return await this.JiraConnection.project.getAllProjects();
  }

  async getProjectByKey(projectKey) {
    const project = await this.JiraConnection.project.getProject({
      projectIdOrKey: projectKey
    });

    return project;
  }

  async getProjectNameByIdOrKey(projectKey) {
    const projectname = (await this.getProjectByKey(projectKey)).name;

    return projectname;
  }

  // Get the all the visable projects for the user from JIRA, populated with their components.*/
  async getProjectsWithComponents() {
    const projects = await this.getAllProjects();

    for (const project of projects) {
      project.components = this.getComponentsByProjectKey(project.key);
    }

    return projects;
  }

  async getProjectsWithComponentsFromCache(key) {
    const value = this.cache.get(key);

    if (value) {
      return value;
    }

    const projects = await this.getAllProjects();
    this.cache.set(key, projects);

    return projects;
  }

  async getComponentsByProjectKey(projectKey) {
    const components = await this.JiraConnection.project.getComponents({
      projectIdOrKey: projectKey
    });

    return components;
  }

  async getLastWorklogs(projectKeys: string[] = [], limit: number = 0, cache) {
    const worklogs: IWorklog[] = await this.JiraDBController.getLastWorklogs(
      projectKeys,
      limit,
      cache
    );

    if (!worklogs) {
      return [];
    }

    return await getWorklogsWithThumbs(worklogs);
  }

  async getWorklogs(options) {
    const worklogs: IWorklog[] = await this.JiraDBController.getWorklogs(
      options
    );

    if (!worklogs) {
      return [];
    }

    return await getWorklogsWithThumbs(worklogs);
  }

  async getUserWorklogs(options = {}) {
    const worklogs = await this.JiraDBController.getUserWorklogs(options);

    const result = worklogs.map(worklog => ({
      ...worklog,
      hoursLogged: Math.round(worklog.hoursLogged),
      timeFromLastWorklog: moment(worklog.timeFromLastWorklog).format(
        "DD-MM-YYYY"
      ),
      hoursBeforeLog: Math.round(worklog.hoursBeforeLog / 60 / 60),
      timeBeforeLog: Object.keys(worklog.timeBeforeLog)
        .reduce((acc, key) => acc + `${worklog.timeBeforeLog[key]} ${key} `, "")
        .trim()
    }));

    return result;
  }

  async getProjectReport(options) {
    const issues = await this.JiraDBController.getIssues(options);

    return _(issues)
      .groupBy("issueid")
      .map((groupedIssues, key) => ({
        issueid: key,
        timeworked: _.sumBy(groupedIssues, groupedIssues =>
          Number(groupedIssues.timeworked)
        ),
        summary: groupedIssues[0].summary,
        description: groupedIssues[0].description
      }))
      .value();
  }
}

const getWorklogsWithThumbs = async (worklogs: IWorklog[] = []) => {
  const worklogsWithThumbs: IWorklogWithThumbs[] = await Promise.all(
    worklogs.map(async worklog => {
      const worklogThumbs = await WorklogThumbs.findOne({
        worklogId: worklog.id
      })
        .select({ users: 1 })
        .lean();

      return {
        id: worklog.id,
        comment: worklog.worklogbody,
        timeSpentSeconds: worklog.timeworked,
        author: worklog.author,
        date: worklog.created,
        dateUpdated: worklog.updated,
        dateStarted: worklog.startdate,
        worklogThumbs
      };
    })
  );

  return worklogsWithThumbs;
};

export default JiraAPIController;
