import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees: Employee[] = [];
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined;
  public allEmployees: Employee[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
      this.getEmployes();
      this.getAllEmployes();
  }

  public getEmployes(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  public getAllEmployes(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        console.log('All : ', response)
        this.allEmployees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  public onAddEmployee(addForm: NgForm): void{
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployes();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void{
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployes();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(id?: number): void{
    if (id) {
      this.employeeService.deleteEmployee(id).subscribe(
        (response: void) => {
          console.log(response);
          this.getEmployes();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public searchEmployees(key: string): void {
    const result: Employee[] = [];
    this.getAllEmployes();
    console.log(key, result, this.allEmployees);

    for(const employee of this.allEmployees) {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.phone.indexOf(key) !== -1) {
        result.push(employee);
      }
    }

    this.employees = result;
    if(result.length === 0 && !key) {
      console.log('Empty');
      this.getEmployes();
    }
    console.log(key, result, this.employees);
  }

  public onOpenModal(mode: String, employee?: Employee) {
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addModal');
    }
    else if (mode === 'update') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateModal');
    }
    else if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteModal');
    }

    container?.appendChild(button);
    button.click();
  }
}
