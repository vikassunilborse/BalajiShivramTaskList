import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { TaskPriority, TaskStatus } from '../../enums/task.enum';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-new-task',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent {
  private fb = inject(FormBuilder);
  taskService = inject(TaskService);
  router = inject(Router);
  taskStatus = TaskStatus;
  taskPriority = TaskPriority;
  destroy$ = new Subject();

  taskForm = this.fb.group({
    tId: new FormControl(`task${this.taskService.getTotalTaskCount() + 1}`, [Validators.required]),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    status: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required])
});

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.createTask(this.taskForm.value as Task).pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          console.log('Task created successfully:', response);
          this.navigateToTaskDashboard();
        },
        (error) => {
          console.error('Error creating task:', error);
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
