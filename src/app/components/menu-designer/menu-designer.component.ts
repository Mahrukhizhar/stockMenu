import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormControlName, FormArray, Validators } from '@angular/forms';
import { StockMenuService } from '../../services/stockMenu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { Service } from '../../models/Service';
import { Menu } from '../../models/Menu';
import { Event } from '../../models/Event';
import { AccountType } from '../../models/AccountType';
import { DataService } from '../../services/data.service';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-menu-designer',
  template: `
  <menu-designer-child [childMessage]="parentMessage"></menu-designer-child>
`,
  templateUrl: './menu-designer.component.html',
  styleUrls: ['./menu-designer.component.css'],
})
export class MenuDesignerComponent implements OnInit {

  menuForm: FormGroup;
  eventForm: FormGroup;
  acctTypeForm: FormGroup;
  headerArr: FormArray;
  orderForm: FormGroup;
  items: FormArray;
  serviceHeader = [];
  services = Array<Service>();
  // selectedServices = Array<Service>();
  events = Array<Event>();
  acctTypes = Array<AccountType>();

  selectedService = [];
  duplicateValidationArray = [];
  submitted = false;
  addEventBtn = false;
  addAcctTypeBtn = false;
  counter = 0;
  orderErrorMessage = '';
  menuSuccessMsgHide = true;
  menuErrorMsgHide = true;
  event_success_status = true;
  event_failure_status = true;
  saveMenuStatus = null;

  constructor(private fb: FormBuilder, private router: Router, private stockMenuService: StockMenuService, private dataService: DataService,
    private route: ActivatedRoute, private locationStrategy: LocationStrategy) {

    this.displaySaveMenuStatus();

    this.route.data.pipe(map(data => data.res)).subscribe((res) => {
      console.log('in constructor');
      console.log(res);
      this.services = res.services;
      this.events = res.events;
      this.acctTypes = res.accTypes;
    });


    locationStrategy.onPopState(() => {
      console.log('here on pop state');
      // this.dataService.getServices();
    });
  }

  ngOnInit() {

    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      event: ['', Validators.required],
      accountType: ['', [Validators.required]],
      services: this.fb.array(this.serviceControls),
      eventHeader: ['', Validators.required],
      headerArr: this.fb.array([])
      // selectedServ: [this.selectedService, Validators.required]
    });

    this.orderForm = this.fb.group({
      items: this.fb.array([])
    });

    this.eventForm = this.fb.group({
      newEvent: ['', [Validators.required]],
    });

    this.acctTypeForm = this.fb.group({
      newAccountType: ['', [Validators.required]]
    });

    this.menuForm.get('event').setValue('CAE');
    this.menuForm.get('accountType').setValue('PREPAID');
    // this.menuForm.valueChanges.subscribe(console.log);
    // this.modalForm.valueChanges.subscribe(console.log);
    this.setMenuOnBackClick(this.dataService.getMenu(), this.dataService.getHeaderArr());
  }

  /* Retrieve Menu Status */
  displaySaveMenuStatus() {
    this.saveMenuStatus = this.dataService.getSaveMenuStatus();
    console.log(this.saveMenuStatus);
    if (this.saveMenuStatus) {
      console.log('first');
      this.menuSuccessMsgHide = false;
      setTimeout(() => {
        this.menuSuccessMsgHide = true;
      }, 4000);
    } else if (this.saveMenuStatus === undefined) {
      console.log('second');
    } else {
      console.log('third');
      this.menuErrorMsgHide = false;
      setTimeout(() => {
        this.menuErrorMsgHide = true;
      }, 4000);
    }
  }
  /*  Sort order code starts */

  createItem(name): FormGroup {
    this.counter = this.counter + 1;

    return this.fb.group({
      name: name,
      order: this.counter,

    });

  }

  addItem(name): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem(name));

  }

  deleteItem(name): void {
    this.counter = this.counter - 1;

    this.items.controls.forEach(element => {
      if (element.get('name').value === name) {
        const index = this.items.controls.indexOf(element);
        this.items.removeAt(index);
      }
    });
    // this.items.removeAt(index);
  }

  sort(index) {

    this.items = this.orderForm.get('items') as FormArray;

    this.items.controls.sort((a, b) =>
      (<FormGroup>a).controls['order'].value - (<FormGroup>b).controls['order'].value);

    console.log(this.items.controls[index].get('order').value);
  }

  /*  Sort order code ends */

  createNewHeaderGroup(serviceName): FormGroup {
    return this.fb.group({
      headerLabel: serviceName,
      headerText: ['', Validators.required]
    });
  }
  get form() {
    return this.menuForm.controls;
  }

  get eForm() {
    return this.eventForm.controls;
  }

  get aForm() {
    return this.acctTypeForm.controls;
  }

  get serviceControls() {
    return this.services.map(c => new FormControl(false));
  }

  get headerArray() {
    return this.menuForm.get('headerArr') as FormArray;
  }

  get serviceArray() {
    return this.menuForm.get('services');
  }

  get event() {
    return this.menuForm.get('event');
  }

  get acctType() {
    return this.menuForm.get('accountType');
  }

  get menuName() {
    return this.menuForm.get('name');
  }

  get eventHeader() {
    return this.menuForm.get('eventHeader');
  }

  save() {

    this.submitted = true;
    console.log('on saving form');
    // this.onOrderSaveClick();
    console.log('this.event');

    if (this.menuForm.invalid || this.selectedService.length === 0) {
      return;
    }
    console.log('form values');
    console.log(this.menuForm.getRawValue().name);
    const menuFormVal = this.menuForm.getRawValue();
    const menu = new Menu(null, [], menuFormVal.name, menuFormVal.event,
      menuFormVal.accountType, menuFormVal.eventHeader,
      menuFormVal.services, menuFormVal.headerArr);

    this.dataService.setHeaderArr(menuFormVal.headerArr);
    this.dataService.setServices(this.selectedService);
    this.dataService.setMenu(menuFormVal);

    console.log(this.dataService.getMenu());
    this.router.navigateByUrl('/next');

    // this.easywayService.saveMenu(menu).subscribe(
    //   data => {
    //     console.log('Menu has been successfully saved');
    //     this.menuSuccessHide = false;
    //     this.fadeOutMsg();

    //     // this.menuForm.reset();
    //   },
    //   error => {
    //     this.menuErrorHide = false;
    //     this.fadeOutMsg();
    //   });

    console.log('form submitted! ');
  }

  addEvent() {
    this.addEventBtn = true;

    console.log('on adding event');

    if (this.eForm.invalid) {
      return;
    }
    const e = this.eventForm.get('newEvent').value;

    if (e !== '') {
      const event = new Event(null, e);
      this.stockMenuService.addEvent(event).subscribe(
        data => {
          console.log(data);
          this.events.push(data);
          this.event_success_status = false;
        },
        error => {
          console.log(error);
          this.event_failure_status = false;
        }
      );
    }
    console.log(this.events);

  }

  resetMsgStatus(type) {
    if (type === 'event') {
      this.event_success_status = true;
      this.event_failure_status = true;
    }
  }
  addAcctType(type) {
    this.addAcctTypeBtn = true;
    console.log('on adding Account type');

    if (this.aForm.invalid) {
      return;
    }

    if (type !== '') {
      this.acctTypes.push(type);
    }
    console.log(this.acctTypes);

  }

  selectedServices() {
    this.selectedService = this.menuForm.value.services
      .map((v, i) => v ? this.services[i] : null)
      .filter(v => v !== null);

    console.log(this.selectedService);
  }

  addTextBox(serviceName) {
    this.headerArr = this.menuForm.get('headerArr') as FormArray;
    this.headerArr.push(this.createNewHeaderGroup(serviceName));
  }

  recreateServiceHeaders(name, header) {
    this.headerArr = this.menuForm.get('headerArr') as FormArray;
    this.headerArr.push(this.recreateNewHeaderGroup(name, header));
  }

  recreateNewHeaderGroup(name, header) {
    return this.fb.group({
      headerLabel: name,
      headerText: header
    });
  }
  deleteTextBox(serviceName) {
    this.headerArr.controls.forEach(element => {
      if (element.get('headerLabel').value === serviceName) {
        const index = this.headerArr.controls.indexOf(element);
        this.headerArr.removeAt(index);
      }
    });
  }

  addHeaderTextbox($event, serviceName) {

    this.selectedServices();

    if ($event) {
      this.addItem(serviceName);
      this.addTextBox(serviceName);

    } else {
      this.deleteItem(serviceName);
      this.deleteTextBox(serviceName);
      const orderFormArray = <FormArray>this.orderForm.controls.items;
      const itemCount = orderFormArray.length;
      for (let i = 0; i < itemCount; i++) {
        orderFormArray.controls[i].patchValue({ 'order': i + 1 });
      }

    }
  }

  addServiceData($event, serviceId, serviceName) {
    this.selectedServices();

  }


  setMenuOnBackClick(menu: Menu, serviceHeaderArr: Array<any>) {
    if (menu) {
      serviceHeaderArr.forEach(service => {
        this.recreateServiceHeaders(service.headerLabel, service.headerText);
      });
      this.menuForm.setValue(this.dataService.getMenu());
      this.selectedServices();
    }
  }

  fadeOutMsg() {
    setTimeout(() => {
      this.orderErrorMessage = '';
    }, 4000);
  }
}
