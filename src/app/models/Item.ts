import { Category } from './Category';

export class Item {

    id: number;
    name: string;
    priority: number;
    category: Category;
    confirmText1: string;
    confirmText2: string;
    wsCode: string;

    constructor(
        id: number,
        name: string,
        priority: number,
        category: Category,
        confirmText1: string,
        confirmText2: string,
        wsCode: string
    ) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.category = category;
        this.confirmText1 = confirmText1;
        this.confirmText2 = confirmText2;
        this.wsCode = wsCode;
    }
}
