export interface User {
  username: string;
  type: {
    isUser: boolean;
    isAdmin: boolean;
  };
}
