import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
   private apiUrl = '/api/tasks';
   private taskCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
   }

  getTasksList(params?: any): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  editTask(id: string, task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Task>(url, task);
  }

  getTaskById(id: string): Observable<Task> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Task>(url);
  }

  setTotalTaskCount(count: number) {
    this.taskCount.next(count);
  }

  getTotalTaskCount(): number {
    return this.taskCount.getValue();
  }

  deleteTask(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
