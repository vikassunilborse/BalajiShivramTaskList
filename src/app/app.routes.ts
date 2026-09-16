import { Routes } from '@angular/router';


export const routes: Routes = [
{
    path: '',
    pathMatch: 'full',
    redirectTo: 'task'
  },
  {
    path: 'task',
    loadComponent: () => import('./features/task/components/task-dashboard/task-dashboard.component').then(m => m.TaskDashboardComponent),
    title: 'Task Dashboard',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/task/components/task-list/task-list.component').then(m => m.TaskListComponent),
        title: 'Task List'
      },
      {
        path: 'new',
        loadComponent: () => import('./features/task/components/new-task/new-task.component').then(m => m.NewTaskComponent),
        title: 'New Task'
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/task/components/edit-task/edit-task.component').then(m => m.EditTaskComponent),
        title: 'Edit Task'
      }
    ]
  }
];
