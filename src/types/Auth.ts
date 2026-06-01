export interface AuthRespone {
  accountID: number;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  birthDate: string;
  DisplayID: string;
  role: {
    roleDescription: string;
  };
}
