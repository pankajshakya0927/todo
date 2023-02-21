import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../configuration/config';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {}

  newTask(task: Task) {
    return this.http.post(
      config.apiBaseUrl + config.urls.newTask,
      task
    );
  }
}
