import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { StockMenuService } from '../../services/stockMenu.service';
// import { ValidateCategory } from '../validators/service-validator';
// import {ServiceObj} from '../../services/demo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { Service } from '../../models/Service';
import { Category } from '../../models/Category';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-service-configuration',
  templateUrl: './service-configuration.component.html',
  styleUrls: ['./service-configuration.component.css']
})

export class ServiceConfigurationComponent implements OnInit {

  @ViewChild('catHeader') catHeaderRef: ElementRef;
  @ViewChild('catName') catNameRef: ElementRef;

  mainForm: FormGroup;
  serviceForm: FormGroup;
  categoryForm: FormGroup;
  categories: FormArray;

  private services: Service[];
  private category: Category[];

  // services = [];
  // updateCategoryOrderObj = [];
  catToBeDeleted = {
    cid: '',
    index: ''
  };
  catNameArr = [];

  serviceErrorMsg = '';
  categorySuccessMessage = '';
  categoryErrorMessage = '';
  categoryModalError = '';
  categoryModalSuccess = '';
  catDuplicateError = '';
  // oldCategoryOrder = '';
  editCategoryIndex;

  isDefaultSelected = true;
  serviceFormSubmitted = false;
  service_success_status = true;
  service_failure_status = true;
  isCatEdit = false;
  cat_success_status = true;
  cat_failure_status = true;
  categoryFormSubmitted = false;


  constructor(private fb: FormBuilder, private easywayService: StockMenuService, private router: ActivatedRoute) {
    this.router.data.pipe(map(data => data.services)).subscribe((res) => {
      console.log('in constructor');
      console.log(res);
      this.services = res;
    });
  }

  ngOnInit() {

    this.mainForm = this.fb.group({
      serviceControl: [''],
      add_service_status: this.fb.control({}),
      categories: this.fb.array([])
    });

    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      categoryId: [''],
      modalCategoryHeader: ['', Validators.required],
      modalCategoryName: ['', Validators.required],
    });

    this.mainForm.get('serviceControl').setValue(0);
    // import('src/assets/dist/js/popover.js');
  }

  /* Service Related Functions */

  onAddServiceClick() {
    this.serviceFormSubmitted = true;
    this.serviceErrorMsg = '';
    this.resetServiceStatusMsg();

    if (this.serviceForm.invalid) {
      return;
    }

    const serviceName = this.serviceForm.get('serviceName').value;

    if (this.checkDuplicateServiceName(serviceName)) {
      console.log('Service name cannot be repeated');
      this.serviceErrorMsg = 'Service name cannot be repeated';
      return;
    }

    if (serviceName !== '') {
      this.easywayService.addService(serviceName).subscribe(
        res => {
          if (res) {
            console.log('success');
            console.log(res);
            this.services.push(res);
            console.log(this.services);
            this.service_success_status = false;
          }
        },
        error => {
          console.log(error);
          this.service_failure_status = false;
        });
    }
  }

  checkDuplicateServiceName(serviceName) {

    const serviceNameArr = this.services.map(function (item) { return item['name'].toLowerCase().trim(); });
    if (serviceNameArr.indexOf(serviceName.toLowerCase().trim()) >= 0) {
      return true;
    }
    return false;
  }

  resetServiceStatusMsg() {
    this.service_success_status = true;
    this.service_failure_status = true;
    this.serviceErrorMsg = '';
  }

  getAllService() {
    this.easywayService.getServices().subscribe(
      (result: Array<Service>) => {
        console.log(result);
        this.services = result;
      },
      error => console.log('error')
    );
  }

  onServiceChange() {
    this.catNameArr = [];
    // clearing the categories that got pushed by prev service selection
    this.clearFormArray(this.mainForm.controls.categories);
    const index = this.mainForm.value.serviceControl;

    if (!Boolean(Number(index))) {
      this.isDefaultSelected = true;
      return;
    }

    this.easywayService.getCatByServiceId(this.services[index - 1].id).subscribe(
      data => {
        console.log('in getCategoryByServiceId subscribe part');
        if (data) {
          console.log(data);

          this.isDefaultSelected = false;

          for (const category of data) {
            this.catNameArr.push(category.name.trim().toLowerCase());
            this.addCategory(category);
          }

          this.sortArray();
        }
      });
  }


  /* Category Related Functions */

  addCategory(category): void {
    this.categories = this.mainForm.get('categories') as FormArray;
    this.categories.push(this.createCategory(category));
  }

  createCategory(category): FormGroup {
    return this.fb.group(category);
  }

  checkDuplicateCategory(categoryName) {

    console.log('cat name array');
    console.log(this.catNameArr);
    if (this.catNameArr.indexOf(categoryName.toLowerCase().trim()) >= 0) {
      return true;
    }

    return false;
  }

  getCategories() {
    return this.mainForm.controls.categories;
  }

  // deleteCategory(index): void {
  //   this.categories.removeAt(index);
  // }

  // Called when order textbox is clicked
  editCategoryOrder(catOrder) {
    // const categoriesArr = this.getCategories() as FormArray;
    // const categoryLen = Number(categoriesArr.length);

    // if (catOrder < categoryLen && catOrder !== '0') {
    //   this.oldCategoryOrder = catOrder;
    // }
  }

  updateOrder(cid, index, newOrder) {

    const categoryLen = this.getCategoryLen();
    // const category = new Category(id, name, header, null, null, []);

    // console.log(cid + '---' + newOrder);
    // this.easywayService.updateCategoryOrder(cid, newOrder).subscribe(data => {
    //   this.sortArray();
    // });
    this.sortArray();
    // if (this.oldCategoryOrder !== newOrder) {
    // this.updateCategoryOrderObj[index].categoryOrder = newOrder;
    // }
  }

  onAddCategoryClick(categoryName, categoryHeader, index) {
    this.categoryFormSubmitted = true;
    const categoryLen = this.getCategoryLen() + 1;
    index = index - 1; // because in ui its index + 1

    if (this.checkDuplicateCategory(categoryName.trim())) {
      console.log('category cannot be repeated');
      this.catDuplicateError = 'Category already exist!';
      this.fadeOutMsg();
      return;
    }

    if (this.categoryForm.invalid) {
      return;
    } else {
      const category = new Category(null, categoryName, categoryHeader, categoryLen, this.services[index], []);
      console.log(index);
      console.log(this.services[index].id);
      this.easywayService.addCategory(category, this.services[index].id).subscribe(data => {
        if (data) {
          console.log(data);
          category.id = data.id;
          this.addCategory(category);
          this.catNameArr.push(categoryName.trim().toLowerCase());
          this.catHeaderRef.nativeElement.value = '';
          this.catNameRef.nativeElement.value = '';

          this.cat_success_status = false;
          this.categoryModalSuccess = 'Category has been added successfully!';
        }
      },
        error => {
          console.log(error);
          this.cat_failure_status = false;
          this.categoryModalError = 'Error occured while adding category.';
        });
    }
  }

  resetCategoryStatusMsg() {
    this.cat_success_status = true;
    this.cat_failure_status = true;
    this.categoryErrorMessage = '';
    // this.serviceForm.reset();
  }

  // Calls when edit icon is clicked
  onSingleCatEditClick(cid, categoryHeader, categoryName, categoryOrder, i) {
    this.editCategoryIndex = Number(i);
    this.isCatEdit = true;
    this.categoryForm.get('categoryId').setValue(cid);
    this.categoryForm.get('modalCategoryName').setValue(categoryName);
    this.categoryForm.get('modalCategoryHeader').setValue(categoryHeader);
  }

  /* Save category after edit is done */
  onEditCategoryClick(id, name, header) {
    console.log('category edited clicked');
    this.categoryFormSubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    } else {

      const category = new Category(id, name, header, null, null, []);
      this.easywayService.updateCategory(category).subscribe(
        res => {
          if (res) {
            this.cat_success_status = false;
            this.categoryModalSuccess = 'Category has been edited successfully!';
            this.categories.at(this.editCategoryIndex).patchValue(res);
          }
        },
        error => {
          this.cat_failure_status = false;
          this.categoryModalError = 'Error occured while adding category.';
          console.log(error);
        });
    }
  }

  onOrderSaveClick() {
    console.log('order save clicked');
    this.categoryErrorMessage = '';
    this.categorySuccessMessage = '';
    const catFormArray = this.mainForm.get('categories') as FormArray;
    const catArr = new Array<Category>();

    const duplicatePresent = this.checkDuplicateInObject(catFormArray, 'priority');
    console.log('duplicatePresent: ' + duplicatePresent);

    if (duplicatePresent) {
      this.categoryErrorMessage = '*Orders cannot be same. \n';
    }

    this.checkOrderBoundaries(catFormArray, 'priority');
    console.log(this.categoryErrorMessage);

    /* if valid orders -> save the order object in database (bulk insert)*/
    if (this.categoryErrorMessage === '') {
      console.log('here');
      catFormArray.controls.forEach(
        (category) => {
          catArr.push(new Category(Number(category['controls']['id']['value']), '', '',
            Number(category['controls']['priority']['value']), null, []));
        }
      );
      console.log(catArr);
      // call API
      this.categorySuccessMessage = 'Category orders have been saved';
    }

    this.fadeOutMsg();

  }

  checkOrderBoundaries(formArrayObj, key) {
    console.log('check order boundaries');
    let bool = false;
    const orderArr = [];
    const len = Number(formArrayObj.length);
    if (len) {
      formArrayObj.controls.forEach((i) => orderArr.push(Number(i['controls'][key]['value'])));
    }

    orderArr.forEach(function (order) {

      if (String(order) === '0' || order > len) {
        console.log('bool');
        bool = true;
      }
    });
    if (bool) {
      console.log(this.categoryErrorMessage);
      this.categoryErrorMessage += '*Category order cannot be zero or greater than category count';
      return;
    }
  }

  checkDuplicateInObject(formArrayObj, key) {
    const orderArr = [];
    if (formArrayObj.length) {
      formArrayObj.controls.forEach((i) => orderArr.push(Number(i['controls'][key]['value'])));
    }

    const isDuplicate = orderArr.some(function (item, idx) {
      /* indexOf returns index of first occurence
      /* some checks for the condition on whole array.
      /* It will return true when indexOf orderArr i
      /* different from the some function item's index */
      return orderArr.indexOf(item) !== idx;
    });
    return isDuplicate;
  }

  sortArray() {
    this.categories = this.mainForm.get('categories') as FormArray;
    // this.updateCategoryOrderObj.sort((a, b) => (a['categoryOrder'] - b['categoryOrder']));
    this.categories.controls.sort((a, b) => (<FormGroup>a).controls['priority'].value
      - (<FormGroup>b).controls['priority'].value);
  }

  clearFormArray = (formArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getCategoryLen() {
    const categoriesArr = this.mainForm.get('categories') as FormArray;
    return Number(categoriesArr.length);
  }

  onDeleteCatClick(cid, index) {
    console.log('del clicked');
    this.catToBeDeleted = {
      cid, index
    };
  }

  deleteCategory() {
    console.log('in delete function');
    this.easywayService.delCategory(this.catToBeDeleted.cid).subscribe(

      data => {
        if (data) {
          console.log('deleted successfully');
          this.categories.removeAt(Number(this.catToBeDeleted.index));
          console.log(this.categories);
          const catFormArray = <FormArray>this.mainForm.controls.categories;
          const catCount = catFormArray.length;
          for (let i = 0; i < catCount; i++) {
            catFormArray.controls[i].patchValue({ 'priority': i + 1 });
          }
        }
      },
      error => {
        this.categoryErrorMessage = 'Category cannot be deleted at this moment. Please try again later.';
        this.fadeOutMsg();
      });

  }
  /* convenience getter for easy access to form fields */

  get sf() { return this.serviceForm.controls; }
  get cf() { return this.categoryForm.controls; }
  get mf() { return this.mainForm.controls; }

  fadeOutMsg() {
    setTimeout(() => {
      this.categoryErrorMessage = '';
      this.categorySuccessMessage = '';
      this.catDuplicateError = '';
      this.categoryModalSuccess = '';
    }, 4000);
  }

}
