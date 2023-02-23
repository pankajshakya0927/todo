import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../models/apiResponse';
import { Board } from '../models/board';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private activeRoute: ActivatedRoute
  ) {}

  taskName: string = '';
  board: Board = {
    name: '',
    isProtected: false,
    password: '',
    dateCreated: new Date(),
    tasks: [],
  };

  ngOnInit(): void {
    const params = this.activeRoute.snapshot.params;
    if (params && params.name) this.board.name = params.name;

    this.getBoard();
  }

  getBoard() {
    if (this.board) {
      this.taskService.getBoard(this.board).subscribe(
        (res) => {
          this.board = (res as ApiResponse).data as Board;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  addTask() {
    if (!this.taskName) return;

    const task: Task = {
      name: this.taskName,
      dueDate: new Date(),
      priority: 0,
      subtasks: [],
      boardName: this.board.name,
    };
    this.board.tasks.push(task);
    this.saveNewTask(task);
  }

  saveNewTask(task: Task) {
    this.taskService.newTask(task).subscribe(
      (res) => {
        this.reset();
        this.getBoard();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  reset() {
    this.taskName = '';
  }

  drop(event: CdkDragDrop<any>) {
    this.board.tasks[event.previousContainer.data.index] =
      event.container.data.item;
    this.board.tasks[event.container.data.index] =
      event.previousContainer.data.item;

    this.taskService.updateBoard(this.board).subscribe(
      (res) => {},
      (err) => {
        console.log(err);
      }
    );
  }
}
