import { Component, OnInit } from '@angular/core';
import { StockMenuService } from '../../services/stockMenu.service';

@Component({
  selector: 'app-view-menus',
  templateUrl: './view-menus.component.html',
  styleUrls: ['./view-menus.component.css']
})
export class ViewMenusComponent implements OnInit {

  menus = [];
  menuServices = [];

  constructor(private stockMenuService: StockMenuService) { }

  ngOnInit() {
    this.stockMenuService.getAllMenus().subscribe(
      data => {
        console.log(data);
        if (data) {
          let services = [];
          let i = 0;
          this.menus = data;
          this.menus.forEach(menu => {
            this.menuServices[i] = '';
            services = menu['services'].split(',');
            services.sort(function (a, b) { return a - b ; });
            services.forEach(s => {
              if (s === '1') {
                this.menuServices[i] += 'Compra Bolsas';
              } else if (s === '2') {
                this.menuServices[i] += ', Compra Pacquetes';
              } else {
                this.menuServices[i] += ', Low Balance Trigger ';
              }
            });
            i++;
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
