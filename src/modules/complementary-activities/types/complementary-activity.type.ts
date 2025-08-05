import { TActivityType } from './activity-type.type';

export type TComplementaryActivity = {
  id: string;
  isRegistered?: boolean | null;
  fileNumber?: string | null;
  progressLevel: string;
  assignmentReportId: string;
  activityTypeId: string;
  // assignmentReport?: TAssignmentReport;
  activityType: TActivityType;
};
