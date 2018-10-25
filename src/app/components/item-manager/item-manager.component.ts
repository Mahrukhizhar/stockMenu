import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { StockMenuService } from '../../services/stockMenu.service';
import { Item } from '../../models/Item';
import { map } from 'rxjs/internal/operators/map';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-item-manager',
  templateUrl: './item-manager.component.html',
  styleUrls: ['./item-manager.component.css']
})

export class ItemManagerComponent implements OnInit {


  @ViewChild('itemName') itemNameRef: ElementRef;
  @ViewChild('wsCode') wsCodeRef: ElementRef;
  @ViewChild('conf_menu_text_1') conf_text_1_ref: ElementRef;
  @ViewChild('conf_menu_text_2') conf_text_2_ref: ElementRef;

  public service: string;
  public category: string;
  public cid: string;
  public editItemIndex: number;

  mainForm: FormGroup;
  itemForm: FormGroup;
  items: FormArray;

  isItemEdit = false;
  item_success_status = true;
  item_failure_status = true;
  itemFormSubmitted = false;

  // itemErrorMsg = '';
  itemErrorMessage = '';
  itemSuccessMessage = '';
  itemDuplicateError = '';
  itemModalSuccess = '';
  itemModalError = '';

  // itemNameArr = [];
  itemToBeDeleted = {
    'itemId': '',
    'index': ''
  };


  constructor(private route: ActivatedRoute, private fb: FormBuilder, private stockMenuService: StockMenuService) { }

  ngOnInit() {
    this.service = this.route.snapshot.paramMap.get('service');
    this.category = this.route.snapshot.paramMap.get('category');
    this.cid = this.route.snapshot.paramMap.get('cid');
    console.log(this.service + '---------' + this.category);

    this.mainForm = this.fb.group({
      items: this.fb.array([])
    });

    this.itemForm = this.fb.group({
      itemId: [''],
      itemName: ['', Validators.required],
      itemOrder: [''],
      wsCode: ['', Validators.required],
      conf_menu_text_1: ['', Validators.required],
      conf_menu_text_2: ['']
    });

    this.getAllItems(this.cid);

  }

  addItem(item): void {
    this.items = this.mainForm.get('items') as FormArray;
    this.items.push(this.createItem(item));
  }

  createItem(item): FormGroup {
    return this.fb.group(item);

  }

  getItems() {
    return this.mainForm.controls.items;
  }

  getAllItems(cid) {
    this.stockMenuService.getItems(cid).subscribe(data => {
      if (data) {
        console.log('in get all items subscribe part');
        console.log(data);

        for (const item of data) {
          // this.itemNameArr.push(item['name']);
          this.addItem(item);
        }

        this.sortArray();
      }
    });
  }

  // Called when order textbox is clicked
  editItemOrder(itemOrder) {
  }

  updateOrder(itemId, index, newOrder) {

    const categoryLen = this.getItemLen();
    this.sortArray();
  }

  onAddItemClick(itemName, wsCode, conf_menu_text_1, conf_menu_text_2) {
    console.log('add item clicked');
    console.log('values=====', itemName, wsCode, conf_menu_text_1, conf_menu_text_2);
    this.itemFormSubmitted = true;
    const itemLen = this.getItemLen() + 1;

    if (this.checkDuplicateItem(itemName.trim())) {
      console.log('Item cannot be repeated');
      this.itemDuplicateError = 'Item already exist!';
      this.fadeOutMsg();
      return;
    }

    if (this.itemForm.invalid) {
      console.log('if part');
      return;
    } else {
      console.log('else part');

      const item = new Item(null, itemName, itemLen, null, conf_menu_text_1, conf_menu_text_2, wsCode);

      this.stockMenuService.addItem(item, this.cid).subscribe(
        data => {
          if (data) {
            item.id = data.id;
            this.addItem(data);
            // this.itemNameArr.push(itemName.trim());
            this.itemNameRef.nativeElement.value = '';
            this.wsCodeRef.nativeElement.value = '';
            this.conf_text_1_ref.nativeElement.value = '';
            this.conf_text_2_ref.nativeElement.value = '';
            this.item_success_status = false;
            this.itemModalSuccess = 'Item has been added successfully!';
          }
        },
        error => {
          this.item_failure_status = false;
          this.itemModalSuccess = 'Error occured while adding item.';
        }
      );
    }
  }

  checkDuplicateItem(itemName) {
    console.log('check duplicate name');
    const itemFormArray = this.mainForm.get('items') as FormArray;
    const itemNameArr = [];
    itemFormArray.controls.forEach((i) => {
      itemNameArr.push(i['controls']['name']['value']);
    });

    if (itemNameArr.indexOf(itemName) >= 0) {
      return true;
    }

    return false;
  }


  // Calls when edit icon is clicked
  onSingleItemEditClick(itemId, itemName, wsCode, conf_menu_text_1, conf_menu_text_2, i) {
    console.log(itemId, itemName, wsCode, conf_menu_text_1, conf_menu_text_2);
    this.isItemEdit = true;
    this.editItemIndex = Number(i);
    this.itemForm.get('itemId').setValue(itemId);
    this.itemForm.get('itemName').setValue(itemName);
    this.itemForm.get('wsCode').setValue(wsCode);
    this.itemForm.get('conf_menu_text_1').setValue(conf_menu_text_1);
    this.itemForm.get('conf_menu_text_2').setValue(conf_menu_text_2);
  }

  /* Save item after edit is done */
  onEditItemClick(itemId, itemName, wsCode, conf_menu_text_1, conf_menu_text_2) {
    console.log('category edited clicked');
    this.itemFormSubmitted = true;
    if (this.itemForm.invalid) {
      return;
    } else {

      const item = new Item(itemId, itemName, null, null, conf_menu_text_1, conf_menu_text_2, wsCode);

      this.stockMenuService.updateItem(item, itemId, this.cid).subscribe(res => {
        if (res) {
          this.item_success_status = false;
          this.itemModalSuccess = 'Item has been edited successfully!';
          this.items.at(this.editItemIndex).patchValue(res);
        }
      });
    }
  }

  onOrderSaveClick() {
    console.log('order save clicked');
    this.itemErrorMessage = '';
    const itemFormArray = this.mainForm.get('items') as FormArray;
    const duplicatePresent = this.checkDuplicateInObject(itemFormArray, 'priority');
    const itemArr = Array<Item>();

    console.log('duplicatePresent: ' + duplicatePresent);
    if (duplicatePresent) {
      this.itemErrorMessage = '*Orders cannot be same. \n';
    }

    this.checkOrderBoundaries(itemFormArray, 'priority');
    console.log(this.itemErrorMessage);

    /* if valid orders -> save the order object in database */
    if (this.itemErrorMessage === '') {
      console.log('here');
      itemFormArray.controls.forEach(
        (category) => {
          itemArr.push(new Item(Number(category['controls']['id']['value']), '',
            Number(category['controls']['priority']['value']), null, '', '', ''));
        }
      );
      console.log(itemArr);
      this.itemSuccessMessage = 'Item orders have been saved';
    }

    this.fadeOutMsg();
  }

  checkOrderBoundaries(formArrayObj, key) {
    console.log('check order boundaries');
    let validOrder = true;
    const orderArr = [];
    const itemCount = Number(formArrayObj.length);

    if (itemCount) {
      formArrayObj.controls.forEach((i) => orderArr.push(Number(i['controls'][key]['value'])));
    }

    orderArr.forEach(function (order) {
      if (String(order) === '0' || order > itemCount) {
        console.log('bool');
        validOrder = false;
      }
    });

    if (!validOrder) {
      console.log(this.itemErrorMessage);
      this.itemErrorMessage += '*Item order cannot be zero or greater than item count';
      return;
    }
  }

  checkDuplicateInObject(formArrayObj, key) {
    const orderArr = [];
    if (formArrayObj.length) {
      formArrayObj.controls.forEach((i) => orderArr.push(Number(i['controls'][key]['value'])));
    }

    console.log(orderArr);
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
    this.items = this.mainForm.get('items') as FormArray;
    this.items.controls.sort((a, b) => (<FormGroup>a).controls['priority'].value
      - (<FormGroup>b).controls['priority'].value);
  }

  clearFormArray = (formArray) => {
    // console.log(formArray);
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getItemLen() {
    const itemArr = this.mainForm.get('items') as FormArray;
    return Number(itemArr.length);
  }

  onDeleteItemClick(itemId, index) {
    console.log('del clicked');
    this.itemToBeDeleted = {
      itemId, index
    };
  }

  deleteItem() {
    this.stockMenuService.delItem(this.itemToBeDeleted.itemId, this.cid).subscribe(
      data => {
        if (data) {
          console.log('deleted successfully');
          // this.itemNameArr.indexOf(this.itemToBeDeleted.name);
          this.items.removeAt(Number(this.itemToBeDeleted.index));
        }
      });
  }

  resetItemStatusMsg() {
    // this.item_success_status = true;
    this.item_failure_status = true;
    // this.itemErrorMsg = '';
    this.item_success_status = true;
    // this.serviceForm.reset();
  }

  /* convenience getter for easy access to form fields */

  get itemform() { return this.itemForm.controls; }
  get mf() { return this.mainForm.controls; }

  fadeOutMsg() {
    setTimeout(() => {
      this.itemErrorMessage = '';
      this.itemDuplicateError = '';
      this.itemSuccessMessage = '';
    }, 4000);
  }
}
