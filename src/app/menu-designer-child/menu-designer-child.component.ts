import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from '../services/data.service';
import { StockMenuService } from '../services/stockMenu.service';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormArray, FormControl } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { Menu } from '../models/Menu';
import { MenuService } from '../models/MenuService';
import { filter } from 'rxjs/operators';
import { Service } from '../models/Service';
import { EasywayService } from '../models/EasywayService';


@Component({
  selector: 'app-menu-designer-child',
  templateUrl: './menu-designer-child.component.html',
  styleUrls: ['./menu-designer-child.component.css']
})

export class MenuDesignerChildComponent implements OnInit {

  menuServiceForm: FormGroup;
  services: FormArray;
  serviceHeader: '';
  categoryHeader: '';

  selectedServiceName = '';
  selectedCatName = '';
  orderErrorMessage = '';
  orderSuccessMessage = '';

  selectedServices = [];
  categories = [];
  items = [];
  menu: Menu;
  userEnteredMenu: Menu;
  counter = 0;


  constructor(private fb: FormBuilder, private location: Location,
    private dataService: DataService, private easywayService: StockMenuService,
    private router: Router) {
  }

  ngOnInit() {
    this.menuServiceForm = this.fb.group({
      services: this.fb.array([])
    });
    this.addService(this.dataService.getServices());
    this.menu = this.dataService.getMenu();
    console.log('ng on init');
    console.log(this.dataService.getMenu());
    console.log(this.menu.eventHeader);
  }

  createService(service): FormGroup {
    this.counter = this.counter + 1;
    console.log(service);
    return this.fb.group({
      id: service.id,
      name: service.name,
      order: this.counter,
      header: this.getServiceHeader(service.name)
    });

  }

  addService(serviceArr): void {
    serviceArr.forEach(service => {
      this.services = this.menuServiceForm.get('services') as FormArray;
      this.services.push(this.createService(service));
    });
  }

  goBack(event) {
    event.preventDefault();
    console.log('go back');
    this.location.back();  // <-- go back to previous location
  }

  onServiceClick(serviceId, serviceName) {
    this.items = [];
    this.categories = [];
    this.selectedCatName = '';
    this.selectedServiceName = serviceName;

    this.serviceHeader = this.getServiceHeader(serviceName);

    this.easywayService.getCatByServiceId(serviceId).subscribe(
      data => {
        if (data) {
          this.categories = data;
        }
      },
      error => {
        console.log(error);
      });
  }

  getServiceHeader(serviceName) {
    const serviceheaderArr = this.dataService.getHeaderArr();
    console.log(serviceheaderArr);
    const filterHeaderObj = serviceheaderArr.filter(function (e) {
      return e.headerLabel === serviceName;
    });

    return filterHeaderObj[0].headerText;
  }

  onCatClick(catId, catName) {
    this.categoryHeader = '';
    this.selectedCatName = catName;
    this.easywayService.getCategoryByCatId(catId).subscribe(
      data => {
        if (data) {
          console.log(data);
          console.log(data['header']);
          this.categoryHeader = data['header'];
        } else {
          this.categoryHeader = '';
        }
      },
      error => {
        console.log(error);
      });

    this.easywayService.getItems(catId).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.items = data;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onSaveClick() {
    console.log('order save clicked');
    this.orderErrorMessage = '';
    this.orderSuccessMessage = '';
    const duplicatePresent = this.checkDuplicateInObject(this.menuServiceForm.get('services') as FormArray, 'order');
    console.log('duplicatePresent: ' + duplicatePresent);
    if (duplicatePresent) {
      this.orderErrorMessage = '*Orders cannot be same. \n';
    }
    this.checkOrderBoundaries();
    console.log(this.orderErrorMessage);

    if (this.orderErrorMessage === '') {
      // this.orderSuccessMessage = 'Orders has been saved successfully';

      const selectedServices = this.dataService.getServices();
      const services = [];

      selectedServices.forEach(service => {
        services.push(service.id);
      });

      const menuToSave = new Menu(null, [], this.dataService.getMenu().name, this.dataService.getMenu().event,
        this.dataService.getMenu().accountType, this.dataService.getMenu().eventHeader,
        services.toString(), []);
      this.easywayService.saveMenu(menuToSave).subscribe(
        menu => {
          console.log('Menu has been successfully saved');
          console.log(menu);
          console.log(this.menuServiceForm.getRawValue().services);
          this.menuServiceForm.getRawValue().services.forEach(service => {
            console.log('in menuService save');
            console.log(menu);
            console.log(service.header);
            console.log(service.order);

            // serviceObj = new EasywayService(Number(service.id), service.name, null, null);
            // menuObj = new Menu(menu.id, [], menu.name, menu.event, menu.accountType, menu.eventHeader,
            // menu.services, menu.headerArr);

            // tslint:disable-next-line:prefer-const
            let menuService = new MenuService(null, null, null, service.order, service.header);
            this.easywayService.saveMenuService(menuService, menu.id, service.id).subscribe(
              data => {
                console.log(data);
                this.dataService.setMenu(null);
                this.dataService.setSaveMenuStatus(true);
                this.router.navigate(['/design/menu']);
              },
              error => {
                console.log(error);
                this.dataService.setMenu(null);
                this.dataService.setSaveMenuStatus(false);
                this.router.navigate(['/design/menu']);
              });
          });
        },
        error => {
          console.log(error);
          // status can be accessed on other page using dataService
          this.dataService.setSaveMenuStatus(false);
          this.router.navigate(['/design/menu']);
        });

    }
    /* if valid orders -> save the order object in database */
    //  if (this.orderErrorMessage === '') {
    //   console.log('here');
    //   this.itemSuccessMessage = 'Item orders have been saved';
    // }

    // this.fadeOutMsg();

  }

  checkDuplicateInObject(items, key) {
    const orderArr = [];
    if (items.length) {
      items.controls.forEach((i) => orderArr.push(Number(i['controls'][key]['value'])));
    }
    console.log(orderArr);
    const isDuplicate = orderArr.some(function (item, idx) {
      /* indexOf returns index of first occurence
      * some checks for the condition on whole array.
      * It will return true when indexOf orderArr i
      * different from the some function item's index
      */
      console.log('orderArr.indexOf(item)', orderArr.indexOf(item));
      return orderArr.indexOf(item) !== idx;
    });
    return isDuplicate;
  }

  checkOrderBoundaries() {
    console.log('check order boundaries');
    let bool = false;
    const orderArr = [];
    const items = this.menuServiceForm.get('services') as FormArray;
    const len = Number(items.length);
    if (len) {
      items.controls.forEach((i) => orderArr.push(Number(i['controls']['order']['value'])));
    }
    console.log(orderArr);
    orderArr.forEach(function (order) {
      console.log(order);
      if (String(order) === '0' || Number(order) > Number(`${len}`)) {
        console.log('bool');
        bool = true;
      }
    });
    if (bool) {
      console.log(this.orderErrorMessage);
      this.orderErrorMessage += '*Service order cannot be zero or greater than service count';
    }
  }

  sortArray() {
    this.services = this.menuServiceForm.get('services') as FormArray;
    // this.updateCategoryOrderObj.sort((a, b) => (a['categoryOrder'] - b['categoryOrder']));
    this.services.controls.sort((a, b) => (<FormGroup>a).controls['order'].value
      - (<FormGroup>b).controls['order'].value);
  }

}
