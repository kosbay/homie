import { IWorklogThumbsModel } from "./WorklogThumbs";

export interface IWorklog {
  id: string;
  worklogbody: string;
  timeworked: string;
  author: string;
  created: Date;
  updated: Date;
  startdate: Date;
}

export interface IWorklogWithThumbs {
  id: string;
  comment: string;
  timeSpentSeconds: string;
  author: string;
  date: Date;
  dateUpdated: Date;
  dateStarted: Date;
  worklogThumbs: IWorklogThumbsModel[];
}
