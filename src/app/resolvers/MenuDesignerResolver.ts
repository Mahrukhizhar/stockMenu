import { Injectable } from '@angular/core';
import { StockMenuService } from '../services/stockMenu.service';

import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class MenuDesignerResolver implements Resolve<any> {
  constructor(private easywayService: StockMenuService) {
      console.log('in const');
  }

  resolve(): Observable<any> {
    console.log('here');
    const a  = this.easywayService.getEvents();
    const b  = this.easywayService.getAccountTypes();
    const c  = this.easywayService.getServices();

     const join = forkJoin(a, b, c).pipe(map((allResponses) => {
         console.log('in resolver map');
         console.log(allResponses);
       return {
         events: allResponses[0],
         accTypes: allResponses[1],
         services: allResponses[2]
       };
     }));

     return join;
  }
}
