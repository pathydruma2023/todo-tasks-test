import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from './tasks.model';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private readonly baseUrl = `${environment.API}tasks`;  

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  read(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  filter(description: string, priority: number): Observable<Task[]> {
    let url = `${this.baseUrl}`;
    if (description && priority)
      url = url + `?description=${description}&priority=${priority}`;
    else if (description)
      url = url + `?description=${description}`;
    else if (priority)
      url = url + `?priority=${priority}`;
    return this.http.get<Task[]>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success'] 
    })
  }

  errorHandler(e: any): Observable<any> {
    console.log(e)
    this.showMessage('Ocorreu um erro!', true)
    return EMPTY
  }
}
