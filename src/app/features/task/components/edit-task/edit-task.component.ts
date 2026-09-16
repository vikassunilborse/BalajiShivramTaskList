import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { TaskPriority, TaskStatus } from '../../enums/task.enum';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-task',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit {
  private fb = inject(FormBuilder);
  taskService = inject(TaskService);
  router = inject(Router);
  taskId: string = '';
  route = inject(ActivatedRoute);
  taskStatus = TaskStatus;
  taskPriority = TaskPriority;
  destroy$ = new Subject();

  taskForm = this.fb.group({
    id: new FormControl('task-0', [Validators.required]),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    status: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required])
});

  constructor() {
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    this.patchFormValues();
  }

  patchFormValues() {
    this.taskService.getTaskById(this.taskId).subscribe((task) => {
      this.taskForm.patchValue(task);
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.editTask(this.taskId, this.taskForm.value as Task).subscribe(
        (response) => {
          console.log('Task updated successfully:', response);
          this.navigateToTaskDashboard();
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );
    }
  }

  navigateToTaskDashboard() {
    this.router.navigate(['/task']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
