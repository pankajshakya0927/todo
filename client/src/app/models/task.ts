export interface Task {
  name: string;
  dueDate: Date | null;
  priority: number;
  subtasks: Subtask[];
  boardName: string;
}

export interface Subtask {
  name: string;
  isCompleted: boolean;
  taskName: string,
  boardName: string
}
