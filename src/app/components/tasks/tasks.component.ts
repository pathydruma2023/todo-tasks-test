import { TasksService } from './tasks.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from './tasks.model';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  formTasks: FormGroup = new FormGroup({});

  tasks!: MatTableDataSource<Task>;
  displayedColumns = ['id', 'description', 'duoData', 'priority'];
  changes = new Subject<void>();
  @ViewChild('paginator')
  paginator!: MatPaginator;

  constructor(private taskService: TasksService, 
    private fb: FormBuilder) {}

    ngOnInit(): void {
      this.formTasks = this.fb.group({
        description: [null],
        priority: [null]
      });
    }
  

    ngAfterViewInit() {
      this.taskService.read().subscribe(tasks => {
        this.tasks = new MatTableDataSource(tasks);
        this.tasks.paginator = this.paginator;
      })
    }

    filterTasks(): void {   
      const description = this.formTasks.controls['description'].value.trim();
      const priority = this.formTasks.controls['priority'].value;
      this.taskService.filter(description, priority).subscribe(tasks => {
        this.tasks = new MatTableDataSource(tasks);
        this.tasks.paginator = this.paginator;
      })    
    }

}
