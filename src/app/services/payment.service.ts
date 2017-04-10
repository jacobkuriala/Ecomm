import { Injectable } from '@angular/core';
import { Http,RequestOptions,Headers } from '@angular/http';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import {Observable} from "rxjs";
import {ShoppingcartService} from "./shoppingcart.service";
import {SearchQuery} from "../models/SearchQuery";

@Injectable()
export class PaymentService {
  paymentid: string;
  cart: SearchQuery[];
  constructor(
    private http: Http,
    private cartservice : ShoppingcartService
  ) { }

  createpayment(data){
    console.log(data);
    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.post('/api/create', JSON.stringify({
      expmon: data.expire_month,
      expyear: data.expire_year,
      fname: data.first_name,
      lname: data.last_name,
      method: data.method,
      cnum: data.number,
      total : data.total,
      type: data.type
    }), options)
      .map(res =>
        res.json()
       ).catch((error, caught) => {
      if (error.status === 400) {
        console.log(error);

      }
      return Observable.throw(error);
    })
      .subscribe(
        result =>
        {
          console.log(result);
          this.paymentid = result.id;
          if(result.state == "approved"){
            this.cartservice.pushtoorders(this.paymentid);
          }
          if(result.state == "failed"){

          }

        }, error=>{
          console.log(error);
        });
  }


}