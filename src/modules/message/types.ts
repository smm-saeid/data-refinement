
export interface Message {
  id: number;
  title: string;
  text: string;
  sender: string;
  receiver: string;
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UsersResponse {
  users: User[];
}
export interface OnMessageProps {
  onClose: () => void;
}
