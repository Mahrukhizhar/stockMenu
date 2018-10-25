import { Service } from './Service';
import { Item } from './Item';

export class Category {
    id: number;
    name: string;
    header: string;
    priority: number;
    service: Service;
    items: Array<Item>;

    constructor(
        id: number,
        name: string,
        header: string,
        priority: number,
        service: Service,
        items: Array<Item>
    ) {
        this.id = id;
        this.name = name;
        this.header = header;
        this.priority = priority;
        this.service = service;
        this.items = items;
    }
}
