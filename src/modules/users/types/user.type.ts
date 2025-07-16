import { TRole } from './role.type';

export type TUser = {
  id: string;
  name: string;
  code: string;
  email: string | null;
  // roleId: string;
  role: TRole;
};
