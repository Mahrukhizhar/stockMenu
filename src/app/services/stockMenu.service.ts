import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../models/Category';
import { Service } from '../models/Service';
import { Item } from '../models/Item';
import { Menu } from '../models/Menu';

// For localStorage
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// import 'rxjs/add/operator/map';

// interface ServiceGetResponse {
//   // success: boolean;
//   message: Array<ServiceObj>;
// }

// interface AccountGetResponse {
//   success: boolean;
//   message: Array<AccountTypeObj>;
// }

interface PostResponse {
  message: string;
}

// export interface ServiceObj {
//   id: number;
//   name: string;
//   categories: Array<any>;
// }

interface AccountPostResponse {
  success: boolean;
  message: string;
}

// interface AccountTypeObj {
//   acc_id: number;
//   accountType: string;
// }

// interface CategoryGetResponse {
//   success: boolean;
//   message: Array<CategoryObj>;
// }

// interface CategoryPostResponse {
//   success: boolean;
//   message: string;
// }

// interface CategoryObj {
//   // id: number;
//   name: string;
//   header: string;
//   service_id: number;
//   priority: number;
// }

// interface ItemObj {
//   id: number;
//   name: string;
//   header: string;
//   service_id: number;
// }

// interface ItemGetResponse {
//   success: boolean;
//   message: Array<CategoryObj>;
// }

// interface ItemPostResponse {
//   success: boolean;
//   message: string;
// }

// interface ItemObj {
//   id: number;
//   item: string;
//   cid: number;
// }

@Injectable({
  providedIn: 'root'
})

export class StockMenuService {

  constructor(private http: HttpClient, @Inject(SESSION_STORAGE) private storage: StorageService) { }

  getAccountTypes() {
    return of(['PREPAID', 'POSTPAID', 'CUENTA_EXACTA']);
  }

  getEvents() {
    // return this.http.get<Event>('/api/events', { responseType: 'json' });
    return of([{ id: 1, name: 'CAE' }, { id: 2, name: 'CAR' }, { id: 3, name: 'CAL' }, { id: 4, name: 'CCA' }, { id: 5, name: 'SMSR' },
    { id: 6, name: 'LDB' }, { id: 7, name: 'LMB' }, { id: 8, name: 'PULL' }]);

  }

  getServices() {
    console.log('in get services');
    // return this.http.get<Array<Service>>('/api/services', { responseType: 'json' });
    return of([{ id: 1, name: 'Compra Bolsas' }, { id: 2, name: 'Compra Pacquetes' }, { id: 3, name: 'Low Balance Trigger' }]);
  }

  getCategories() {
    // return this.http.get<Array<Category>>('/api/get/categories');
    return this.storage.get('categories');
  }

  getItems(category_id) {
    console.log('in get items');
    // return this.http.get<Array<Item>>(`/api/items/categories/${category_id}`);
    return of(this.storage.get(`${category_id}-items`));
  }

  addService(name) {
    console.log('add service call', name);
    return this.http.post<Service>('/api/service/add', { name });
    // .pipe(
    //   catchError(this.handleError)
    // );
  }

  addEvent(event) {
    console.log('add event call', event);
    return this.http.post<Service>('/api/event/add', event);
    // .pipe(
    //   catchError(this.handleError)
    // );
  }

  addAccountType(accountType) {
    return this.http.post<AccountPostResponse>('/api/add/accountType', {
      accountType // service:service
    });
  }

  addCategory(category, serviceId) {
    console.log('category: {}', category);
    console.log(serviceId);
    // return this.http.post<Category>(`/api/services/${serviceId}/category/add`,
    //   category
    // );

    // get array of tasks from local storage
    const categories = this.storage.get(`${serviceId}-categories`) || [];

    // push new category to array
    category.id = categories.length + 1;
    categories.push(category);

    // insert updated array to local storage
    this.storage.set(`${serviceId}-categories`, categories);

    console.log(this.storage
      .get(`${serviceId}-categories`) || 'LocaL storage is empty');

    return of(category);
  }

  updateCategory(category, serviceId) {
    // return this.http.post<Category>(`/api/categories/${category.id}/update`,
    //   category
    // );

    const categories = this.storage.get(`${serviceId}-categories`);
    const index = categories.findIndex(cat => cat.id === category.id);
    category.priority = categories[index].priority;
    categories[index] = category;
    this.storage.set(`${serviceId}-categories`, categories);
    return of(category);
  }

  updateItem(item, id, cid) {
    console.log('update item');
    // return this.http.post<Item>(`/api/items/${id}/update`, item);

    const items = this.storage.get(`${cid}-items`);
    const index = items.findIndex(it => it.id === item.id);
    item.priority = items[index].priority;
    items[index] = item;
    this.storage.set(`${cid}-items`, items);
    return of(item);
  }

  addItem(item, cid) {
    console.log('/api/item/add', cid);
    // return this.http.post<Item>(`/api/categories/${cid}/item/add`, item);
    // get array of tasks from local storage
    const items = this.storage.get(`${cid}-items`) || [];

    // push new category to array
    item.id = items.length + 1;
    items.push(item);

    // insert updated array to local storage
    this.storage.set(`${cid}-items`, items);

    console.log(this.storage
      .get(`${cid}-items`) || 'LocaL storage is empty');

    return of(item);
  }

  getCatByServiceId(service_id) {
    console.log('here 1');
    // return this.http.get<Array<Category>>(`/api/services/${service_id}/categories`);
    return of(this.storage.get(`${service_id}-categories`));
  }

  getCategoryByCatId(cat_id) {
    console.log('here 1');
    // return this.http.get<Array<Category>>(`/api/category/${cat_id}`);
    const catArr = this.storage.get(`${cat_id}-categories`);
    const index = catArr.findIndex(cat => cat.id === cat_id);
    return of(catArr[index]);
  }

  // getItemsByCatId(cat_id) {
  //   console.log('here 2' + cat_id);
  //   return this.http.get<Array<Item>>('/api/get/items/' + cat_id);
  // }

  updateCategoryOrder(cid, order) {
    return this.http.post<PostResponse>('/api/update/category/order', {
      cid, order // service:service
    });
  }

  delCategory(cid, serviceId) {
    // return this.http.delete<any>(`/api/category/${cid}/delete`, {});
    const categories = this.storage.get(`${serviceId}-categories`) || [];
    const index = categories.findIndex(cat => cat.id === cid);
    if (index > -1) {
      categories.splice(index, 1);
    } this.storage.set(`${serviceId}-categories`, categories);
    return of('deleted');
  }

  delItem(id, cid) {
    // return this.http.delete<any>(`/api/items/${id}/delete`, {});
    const items = this.storage.get(`${cid}-items`) || [];
    const index = items.findIndex(item => item.id === id);
    console.log('index: ' + index);
    if (index > -1) {
      items.splice(index, 1);
    }
    console.log(items);
    this.storage.set(`${cid}-items`, items);
    // console.log(thi)
    return of('deleted');
  }

  saveMenu(menu) {
    console.log(menu);
    // return this.http.post<Menu>('/api/menu/add',
    //   menu
    // );
    const menus = this.storage.get(`menus`) || [];
    menu.id = menus.length + 1;
    menus.push(menu);
    this.storage.set(`menus`, menus);

    return of(menu);
  }

  saveMenuService(menuService, menuId, serviceId) {
    console.log('menuService');
    console.log(menuService);
    // return this.http.post<Menu>(`/api/menu/${menuId}/service/${serviceId}/save`,
    //   menuService
    // );
    const menuServices = this.storage.get(`menuServices`) || [];
    menuService.id = menuServices.length + 1;
    menuServices.push(menuService);
    this.storage.set(`menuServices`, menuServices);

    return of(menuService);
  }

  getAllMenus() {
    // return this.http.get<Array<Menu>>(`/api/menus`);
    return of(this.storage.get('menus'));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
