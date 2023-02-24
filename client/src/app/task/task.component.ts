import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Board } from '../models/board';
import { Task, Subtask } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  constructor(private taskService: TaskService) {}

  @Input() task!: Task;
  @Output() getBoard: EventEmitter<Board> = new EventEmitter();

  subtaskName: string = '';

  ngOnInit(): void {}

  addSubtask() {
    if (this.subtaskName && this.task) {
      const subtask: Subtask = {
        name: this.subtaskName,
        isCompleted: false,
        taskName: this.task.name,
        boardName: this.task.boardName,
      };
      this.task.subtasks.push(subtask);
      this.saveNewSubtask(subtask);
    }

    this.subtaskName = '';
  }

  saveNewSubtask(subtask: Subtask) {
    this.taskService.saveNewSubtask(subtask).subscribe(
      (res) => {
        this.getBoard.emit();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  markAsComplete(checked: boolean, subtask: Subtask) {
    if (subtask) subtask.isCompleted = checked;
    this.updateSubtask(subtask);
  }

  updateSubtask(subtask: Subtask) {
    this.taskService.isCompleteSubtask(subtask).subscribe(
      (res) => {
        this.getBoard.emit();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
