import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../configuration/config';
import { Board } from '../models/board';
import { Subtask, Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getBoard(board: Board) {
    return this.http.post(config.apiBaseUrl + config.urls.getBoard, board);
  }

  updateBoard(board: Board) {
    return this.http.post(config.apiBaseUrl + config.urls.updateBoard, board);
  }

  newTask(task: Task) {
    return this.http.post(config.apiBaseUrl + config.urls.newTask, task);
  }

  updateTask(task: Task) {
    return this.http.post(config.apiBaseUrl + config.urls.updateTask, task);
  }

  deleteTask(task: Task) {
    return this.http.post(config.apiBaseUrl + config.urls.deleteTask, task)
  }

  saveNewSubtask(subtask: Subtask) {
    return this.http.post(config.apiBaseUrl + config.urls.newSubtask, subtask);
  }

  updateSubtask(subtask: Subtask) {
    return this.http.post(config.apiBaseUrl + config.urls.updateSubtask, subtask);
  }

  deleteSubtask(subtask: Subtask) {
    return this.http.post(config.apiBaseUrl + config.urls.deleteSubtask, subtask)
  }
}
