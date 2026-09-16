import { Component, inject, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TaskPriority, TaskStatus } from '../../enums/task.enum';
import { debounceTime, distinctUntilChanged, filter, map, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnDestroy {
  searchTerm: string = '';
  taskList: Task[] = [];
  router = inject(Router);
  filteredTaskList: Task[] = [];
  taskStatus = TaskStatus;
  taskPriority = TaskPriority;
  selectedStatus: string = TaskStatus.ALL;
  selectedPriority: string = TaskPriority.ALL;
  destroy$ = new Subject();

  constructor(private taskService: TaskService) {
    this.getTaskList();
  }

  getTaskList() {
    this.taskService.getTasksList().pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.taskList = data;
      this.onFilterChange(this.searchTerm);
    });
  }

  onFilterChange(event: string) {
    this.filteredTaskList = this.taskList.filter((task: Task) => task.title.includes(event));
  }

  getFilteredTaskListByStatus(status: string) {
    this.filteredTaskList = this.filterTasksByStatus(status);
  }

  filterTasksByStatus(status: string) {
    let filterTasks = [];
    if (status === TaskStatus.ALL) {
      filterTasks = this.taskList;
    } else if (status === TaskStatus.OVERDUE) {
      filterTasks =  this.taskList.filter((task: Task) => task.status === TaskStatus.TODO && new Date(task.dueDate) < new Date());
    } else {
      filterTasks = this.taskList.filter((task: Task) => task.status === status);
    }
    return filterTasks;
  }

  getFilteredTaskListByPriority(priority: string) {
    if (priority === TaskPriority.ALL) {
      this.filteredTaskList = this.taskList;
    } else {
      this.filteredTaskList = this.taskList.filter((task: Task) => task.priority === priority);
    }
  }

  filterTasksBy(status: string) {
    let filterTasks = [];
    if (status === TaskStatus.ALL) {
      filterTasks = this.taskList;
    } else if (status === TaskStatus.OVERDUE) {
      filterTasks =  this.taskList.filter((task: Task) => task.status === TaskStatus.TODO && new Date(task.dueDate) < new Date());
    } else {
      filterTasks = this.taskList.filter((task: Task) => task.status === status);
    }
    return filterTasks;
  }

  createTask() {
    this.router.navigate(['/task/new']);
  }

  editTask(id: string) {
    this.router.navigate([`/task/${id}/edit`]);
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.getTaskList();
        this.onFilterChange(this.searchTerm);
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  getTaskByStatus(status: string): number {
    return this.filterTasksByStatus(status).length;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
