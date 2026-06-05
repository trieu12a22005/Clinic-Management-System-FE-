export interface AuthRespone {
  accountID: number;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  birthDate: string;
  DisplayID: string;
  avatar?: string;
  role: {
    roleDescription: string;
    roleName?: string;
  };
  roleDescription?: string;
  permissions?: string[];
}
