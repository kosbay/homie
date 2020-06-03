interface IAuthor {
  avatar: string;
  displayName: string;
  key: string;
  name: string;
  self: string;
}

interface IIssue {
  id: number;
  issueType: {
    iconUrl: string;
    name: string;
  };
  key: string;
  projectId: number;
  remainingEstimateSeconds: number;
  self: string;
  summary: string;
}

export interface ITest {
  author: IAuthor;
  comment: string;
  dateCreated: string;
  dateStarted: string;
  dateUpdated: string;
  id: number;
  issue: IIssue;
  jiraWorklogId: number;
  self: string;
  timeSpentSeconds: number;
  workAttributeValues: [];
  worklogAttributes: [];
}
