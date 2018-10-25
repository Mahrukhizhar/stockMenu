import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../models/Category';
import { Service } from '../models/Service';
import { Item } from '../models/Item';
import { Menu } from '../models/Menu';

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

  constructor(private http: HttpClient) { }

  getAccountTypes() {
    return this.http.get<Account>('/api/account-types', { responseType: 'json' });
  }

  getEvents() {
    return this.http.get<Event>('/api/events', { responseType: 'json' });
  }

  getServices() {
    console.log('in get services');
    return this.http.get<Array<Service>>('/api/services', { responseType: 'json' });
  }

  getCategories() {
    return this.http.get<Array<Category>>('/api/get/categories');
  }

  getItems(category_id) {
    console.log('in get items');
    return this.http.get<Array<Item>>(`/api/items/categories/${category_id}`);
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
    return this.http.post<Category>(`/api/services/${serviceId}/category/add`,
      category
    );
  }

  updateCategory(category) {
    return this.http.post<Category>(`/api/categories/${category.id}/update`,
      category
    );
  }

  updateItem(item, id) {
    console.log('update item');
    return this.http.post<Item>(`/api/items/${id}/update`, item);
  }

  addItem(item, cid) {
    console.log('/api/item/add', cid);
    return this.http.post<Item>(`/api/categories/${cid}/item/add`, item);
  }

  getCatByServiceId(service_id) {
    console.log('here 1');
    return this.http.get<Array<Category>>(`/api/services/${service_id}/categories`);
  }

  getCategoryByCatId(cat_id) {
    console.log('here 1');
    return this.http.get<Array<Category>>(`/api/category/${cat_id}`);
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

  delCategory(cid) {
    return this.http.delete<any>(`/api/category/${cid}/delete`, {});
  }

  delItem(id) {
    return this.http.delete<any>(`/api/items/${id}/delete`, {});
  }

  saveMenu(menu) {
    console.log(menu);
    return this.http.post<Menu>('/api/menu/add',
      menu
    );
  }

  saveMenuService(menuService, menuId, serviceId) {
    console.log('menuService');
    console.log(menuService);
    return this.http.post<Menu>(`/api/menu/${menuId}/service/${serviceId}/save`,
      menuService
    );
  }

  getAllMenus() {
    return this.http.get<Array<Menu>>(`/api/menus`);
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
