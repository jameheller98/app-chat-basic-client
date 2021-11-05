import { User } from "../User/interfaceUser";

export interface Message {
  id: string;
  timestamp: number;
  text: string;
  sender: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  users: string[];
  typingUsers: string[];
  isCommunity: boolean;
}

export interface Chat {
  activeThread: Thread | null;
  users: User[];
  threads: Thread[];
}
