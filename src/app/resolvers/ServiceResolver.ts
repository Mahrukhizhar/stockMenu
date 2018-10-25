import { Injectable } from '@angular/core';
import { StockMenuService } from '../services/stockMenu.service';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ServiceResolver implements Resolve<any> {
  constructor(private easywayService: StockMenuService) {}

  resolve(): Observable<any> {
    console.log('here');
    return this.easywayService.getServices();
  }
}
