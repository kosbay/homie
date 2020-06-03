import { ITest } from "./Test";

export interface IProject {
  avatarUrls: {
    "16x16": string;
    "24x24": string;
    "32x32": string;
    "48x48": string;
  };
  components: object;
  expand: string;
  id: string;
  key: string;
  monthly_budget: number;
  name: string;
  projectTypeKey: string;
  remaining: number;
  self: string;
  spent: number;
  worklogs: ITest[];
  isMaintenance: boolean;
  accum_budget: number;
}
