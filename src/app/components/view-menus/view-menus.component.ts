import { Component, OnInit } from '@angular/core';
import { StockMenuService } from '../../services/stockMenu.service';

@Component({
  selector: 'app-view-menus',
  templateUrl: './view-menus.component.html',
  styleUrls: ['./view-menus.component.css']
})
export class ViewMenusComponent implements OnInit {

  menus = [];

  constructor(private stockMenuService: StockMenuService) { }

  ngOnInit() {
    this.stockMenuService.getAllMenus().subscribe(
      data => {
        if (data) {
          this.menus = data;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
