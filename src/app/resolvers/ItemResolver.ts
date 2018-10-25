import { Injectable } from '@angular/core';
import { StockMenuService } from '../services/stockMenu.service';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ItemResolver implements Resolve<any> {
  constructor(private easywayService: StockMenuService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
      console.log('here in item resolver');
    return this.easywayService.getItems(route.params.cid);
  }
}
