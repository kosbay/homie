import { Pool } from "pg";
import moment from "moment";

import config from "../config/connections";

class JiraDBController {
  JiraDBConnection: any;

  constructor() {
    this.JiraDBConnection = new Pool(config.jira_db_connection);
  }

  async getWorklogs(options) {
    if (!options.projectKey) {
      return [];
    }

    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    options.dateTo = moment(options.dateTo || moment()).format(dateFormat);
    options.dateFrom = moment(options.dateFrom || moment("20000101")).format(
      dateFormat
    );

    const { projectKey, dateTo, dateFrom } = options;
    const query = `
      SELECT id, worklogbody, timeworked, author, created, updated, startdate
      FROM worklog
      WHERE issueid IN 
        (SELECT id FROM jiraissue WHERE project IN (SELECT id FROM project WHERE pkey = '${projectKey}')) 
        AND startdate BETWEEN '${dateFrom}' AND '${dateTo}' 
    `;

    return await this.postgresQuery(query);
  }

  async getLastWorklogs(
    projectKeys: string[] = [],
    limit: number = 0,
    cache = false
  ) {
    if (!projectKeys) {
      return [];
    }

    const OFFSET = cache ? 0 : limit;
    const LIMIT = cache && limit !== 0 ? Number(limit) + 20 : 20;

    const query = `
      SELECT id, worklogbody, timeworked, author, created, updated, startdate
      FROM worklog
      WHERE issueid IN 
        (SELECT id FROM jiraissue WHERE project IN 
          (SELECT id FROM project WHERE pkey = ANY('{${projectKeys}}'::text[]))) 
      ORDER BY startdate DESC, id
      OFFSET ${OFFSET} ROWS 
      FETCH FIRST ${LIMIT} ROWS ONLY;
      `;

    return await this.postgresQuery(query);
  }

  async getIssues(options) {
    if (!options.projectKeys) {
      return [];
    }

    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    const dateFrom = moment()
      .subtract(1, "months")
      .startOf("month")
      .format(dateFormat);
    const dateTo = moment()
      .subtract(1, "months")
      .endOf("month")
      .format(dateFormat);

    const query = `
      SELECT timeworked, startdate, worklog.id, author,
        jiraissue.id AS issueid, jiraissue.summary, jiraissue.description
      FROM worklog
      INNER JOIN jiraissue ON worklog.issueid = jiraissue.id
      WHERE issueid IN 
        (SELECT id FROM jiraissue WHERE project IN
          (SELECT id FROM project WHERE pkey = ANY('{${options.projectKeys}}'::text[])))
        AND worklog.startdate BETWEEN '${dateFrom}' AND '${dateTo}'
      FETCH FIRST 100 ROWS ONLY;
      `;

    return await this.postgresQuery(query);
  }

  async getUserWorklogs(options) {
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    const {
      dateFrom = moment()
        .startOf("month")
        .format(dateFormat),
      dateTo = moment()
        .endOf("month")
        .format(dateFormat),
      projectKey
    } = options;

    const conditionPerProject = `issueid IN
      (SELECT id FROM jiraissue WHERE project IN
        (SELECT id FROM project WHERE pkey = '${projectKey}')) AND `;

    const query = `
      SELECT author, TRUNC(SUM(timeworked) / 3600, 2) as "hoursLogged",
        EXTRACT(EPOCH FROM AVG(AGE(updated, startdate))) as "hoursBeforeLog",
        DATE_TRUNC('hour', AVG(AGE(updated, startdate))) as "timeBeforeLog",
        MAX(startdate) as "timeFromLastWorklog"
      FROM worklog
      WHERE ${
        projectKey ? conditionPerProject : ""
      }startdate BETWEEN '${dateFrom}' AND '${dateTo}'
      GROUP BY author
    `;

    return await this.postgresQuery(query);
  }

  postgresQuery(query) {
    return new Promise((resolve, reject) => {
      try {
        this.JiraDBConnection.query(query, (error, result) => {
          resolve(result ? result.rows : []);
        });
      } catch (err) {
        resolve(false);
      }
    });
  }
}

export default JiraDBController;
