import { Task } from "./task";

export interface Board {
  name: string;
  isProtected: boolean;
  password: string;
  dateCreated: Date | null;
  tasks: Task[]
  bgColor: String;
}
