import { Service } from './Service';
import { Menu } from './Menu';
import { EasywayService } from './EasywayService';

export class MenuService {
    id: number;
    menu: Menu;
    service: EasywayService;
    serviceOrderInMenu: number;
    serviceHeader: string;

    constructor(
        id: number,
        menu: Menu,
        service: EasywayService,
        serviceOrderInMenu: number,
        serviceHeader: string,
    ) {
        this.id = id;
        this.menu = menu;
        this.service = service;
        this.serviceOrderInMenu = serviceOrderInMenu;
        this.serviceHeader = serviceHeader;
    }

    getId() {
        return this.id;
    }

    getMenu() {
        return this.menu;
    }

    getService() {
        return this.service;
    }

    getServiceOrderInMenu() {
        return this.serviceOrderInMenu;
    }

    getServiceHeader() {
        return this.serviceHeader;
    }
}

