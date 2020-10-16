import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Customer } from './customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }


  onRegister(customers: Customer): Observable<Customer[]> {
    console.log(customers);
    return this.http.post<Customer[]>("http://localhost:3001/register", customers, {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }

  getAllCust(): Observable<Customer[]> {
    return this.http.get<Customer[]>("http://localhost:3001/customers", {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }

  getcustomer(_id: string): Observable<Customer[]> {
    let obj = {
      "_id": _id
    }
    return this.http.post<Customer[]>("http://localhost:3001/getCustomer", obj, {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }

  onIdUpdate(customers: Customer): Observable<Customer[]> {
    return this.http.put<Customer[]>("http://localhost:3001/updateCustomer", customers, {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }

  onIdDelete(_id: string): Observable<Customer[]> {
    var id = {
      "_id": _id
    }
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id,
    };
    return this.http.delete<Customer[]>('http://localhost:3001/deleteCustomer', options);
  }

}
