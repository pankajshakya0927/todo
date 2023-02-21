import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  tasks: Task[] = [];
  cardName: string = '';
  
  ngOnInit(): void {
  }
  
  addCard() {
    if (!this.cardName) return; 
    
    let task: Task = {
      name: this.cardName,
      dueDate: new Date(),
      priority: 0,
      subtasks: []
    }
    this.tasks.push(task);

    this.taskService.newTask(task).subscribe(res => {
      this.reset();
    }, err => {
      console.log(err);
    })
  }

  reset() {
    this.cardName = '';
  }

  drop(event: CdkDragDrop<any>) {
    this.tasks[event.previousContainer.data.index] = event.container.data.item;
    this.tasks[event.container.data.index] = event.previousContainer.data.item;
  }
}
