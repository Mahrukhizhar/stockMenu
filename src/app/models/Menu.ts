import { Service } from './Service';
import { MenuService } from './MenuService';

export class Menu {
    id: number;
    menuServices: Array<MenuService>;
    name: string;
    event: string;
    accountType: string;
    eventHeader: string;
    services: string;
    headerArr: Array<any>;

    constructor(
        id: number,
        menuServices: Array<MenuService>,
        name: string,
        event: string,
        accountType: string,
        eventHeader: string,
        services: string ,
        headerArr: Array<any>
    ) {
        this.id = id;
        this.menuServices = menuServices;
        this.name = name;
        this.event = event;
        this.accountType = accountType;
        this.eventHeader = eventHeader;
        this.services = services;
        this.headerArr = headerArr;
    }

    getId() {
        return this.id;
    }

    getMenuServices() {
        return this.menuServices;
    }

    getName() {
        return this.name;
    }

    getEvent() {
        return this.event;
    }

    getAccountType() {
        return this.accountType;
    }

    getEventHeader() {
        return this.eventHeader;
    }

    getHeaderArr() {
        return this.headerArr;
    }

    setServices(services: string) {
        this.services = services;
    }

    setMenuServices(menuServices: Array<MenuService> ) {
        this.menuServices = menuServices;
    }
}

