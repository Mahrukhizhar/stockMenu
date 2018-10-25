import { Injectable } from '@angular/core';
import { Menu } from '../models/Menu';
import { Service } from '../models/Service';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  menu: Menu;
  services: Array<any>;
  headerArr: Array<any>;
  saveMenuStatus: boolean;

  constructor() { }

  getMenu(): Menu {
    return this.menu;
  }

  setMenu(menu) {
    this.menu = menu;
  }

  getServices(): Array<any> {
    return this.services;
  }

  setServices(services) {
    this.services = services;
  }

  getHeaderArr(): Array<any>  {
    return this.headerArr;
  }

  setHeaderArr(headerArr) {
    this.headerArr = headerArr;
  }

  getSaveMenuStatus(): boolean {
    return this.saveMenuStatus;
  }

  setSaveMenuStatus(status: boolean) {
    this.saveMenuStatus = status;
  }

}
