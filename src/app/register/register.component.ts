import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormControlName, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Customer } from './customer';
import { RegisterService } from "./register.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {

  customers: Customer[] = [];
  selectedCustomer: Customer;

  ngForm = this.fb.group({
    _id: [''],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    department: ['', Validators.required],
    user_name: ['', Validators.required],
    user_password: ['', Validators.required],
    confirm_password: ['', Validators.required],
    email: ['', Validators.required],
    contact_no: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private registerService: RegisterService, private router: Router) { }

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.registerService.getAllCust().subscribe(res => {
      console.log(res);
      this.customers = res;
    }, err => {
      console.log(err);
    })
  }

  onSubmit(customers: Customer) {

    console.log(customers);
    if (customers._id) {
      this.registerService.onIdUpdate(customers).subscribe(res => {
        console.log(res);
        this.ngOnChanges();
        alert("Customer Update Successfully...")
        this.ngForm.reset();
      }, err => {
        console.log(err);
      })
    }

    else {
      this.registerService.onRegister(customers).subscribe(res => {
        console.log(res);
        this.ngOnChanges();
        alert("Customer Registration Successfully...")
        this.ngForm.reset();
      }, err => {

      });
    }
  }

  onEdit(_id: string, customer: Customer) {
    console.log(_id);
    this.selectedCustomer = customer;
    let newCust: Customer = {
      _id: this.selectedCustomer._id,
      first_name: this.selectedCustomer.first_name,
      last_name: this.selectedCustomer.last_name,
      department: this.selectedCustomer.department,
      user_name: this.selectedCustomer.user_name,
      user_password: this.selectedCustomer.user_password,
      confirm_password: this.selectedCustomer.confirm_password,
      email: this.selectedCustomer.email,
      contact_no: this.selectedCustomer.contact_no
    }
    this.registerService.getcustomer(_id).subscribe(res => {
      // this.customers = customers;
      this.ngForm.patchValue(newCust);
    }, err => {
      console.log(err);
    })
  }

  onDelete(_id: string) {
    console.log(_id);
    if (confirm("are You Sure want to Delete this CustomerId Data...???")) {
      this.registerService.onIdDelete(_id).subscribe(res => {
        console.log(res);
        this.ngOnChanges();
        alert("CustomerId Data Deleted Successfully...");
      }, err => {

      })
    }
  }


}
