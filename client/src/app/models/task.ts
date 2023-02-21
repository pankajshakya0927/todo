export interface Task {
    name: string,
    dueDate: Date,
    priority: number
    subtasks: Subtask[],
}

export interface Subtask {
    name: string,
    isCompleted: boolean
}