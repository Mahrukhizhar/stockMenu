import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule } from 'angular-webstorage-service';

import { AppComponent } from './app.component';

import { AuthGuard } from './guards/auth.guard';
import { ItemManagerComponent } from './components/item-manager/item-manager.component';
import { ServiceConfigurationComponent } from './components/service-configuration/service-configuration.component';
import { MenuDesignerComponent } from './components/menu-designer/menu-designer.component';
import { AppheaderComponent } from './components/appheader/appheader.component';
import { AppfooterComponent } from './components/appfooter/appfooter.component';
import { AppmenuComponent } from './components/appmenu/appmenu.component';
import { AppsettingComponent } from './components/appsetting/appsetting.component';

import { ServiceResolver } from './resolvers/ServiceResolver';
import { ItemResolver } from './resolvers/ItemResolver';
import { MenuDesignerResolver } from './resolvers/MenuDesignerResolver';
import { ViewMenusComponent } from './components/view-menus/view-menus.component';
import { MenuDesignerChildComponent } from './menu-designer-child/menu-designer-child.component';
// import { ViewMenusComponent } from './view-menus/view-menus.component';

import { DataService } from './services/data.service';

// import { ErrorHandler } from '@angular/core';
// import { ErrorsHandler } from './errors-handler';

@NgModule({
  declarations: [
    AppComponent,
    ServiceConfigurationComponent,
    ItemManagerComponent,
    MenuDesignerComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppmenuComponent,
    AppsettingComponent,
    ViewMenusComponent,
    MenuDesignerChildComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StorageServiceModule,
    RouterModule.forRoot([
      {
        path: 'design/menu',
        component: MenuDesignerComponent,
        resolve: {
          res: MenuDesignerResolver
        }
      },
      {
        path: 'configure/service',
        component: ServiceConfigurationComponent,
        resolve: {
          services: ServiceResolver
        }
      },
      {
        path: 'manage/items/:service/:category/:cid',
        component: ItemManagerComponent
        // resolve: {
        //   items: ItemResolver
        // }
      },
      {
        path: 'view/menus',
        component: ViewMenusComponent
        // resolve: {
        //   items: ItemResolver
        // }
      },
      {
        path: 'next',
        component: MenuDesignerChildComponent
        // resolve: {
        //   items: ItemResolver
        // }
      },
      {
        path : '',
        component: ServiceConfigurationComponent,
        resolve: {
          services: ServiceResolver
        }
      }
    ])
  ],
  providers: [
    AuthGuard,
    ServiceResolver,
    MenuDesignerResolver,
    DataService
    // {
    //   provide: ErrorHandler,
    //   useClass: ErrorsHandler,
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
