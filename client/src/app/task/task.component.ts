import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Task, Subtask } from '../models/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor() { }

  @Input() task!: Task;
  subtaskName: string = '';

  ngOnInit(): void {
  }

  addSubtask(card: Task) {
    if (this.subtaskName && card) {
      const subtask: Subtask = {
        name: this.subtaskName,
        isCompleted: false
      }
      card.subtasks.push(subtask);
    }

    this.subtaskName = '';
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
