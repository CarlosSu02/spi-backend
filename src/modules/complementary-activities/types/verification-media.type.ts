export type TVerificationMedia = {
  id: string;
  description: string;
  // url: string | null;
  // multimediaTypeId: string;
  activityId: string;
  verificationMediaFiles: TVerificationMediaFile[];
};

export type TVerificationMediaFile = {
  id: string;
  url: string;
  multimediaTypeId: string;
  verificationMediaId: string;
};
