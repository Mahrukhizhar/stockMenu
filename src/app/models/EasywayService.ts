import { Category } from './Category';
import { MenuService } from './MenuService';

export class EasywayService {
    id: number;
    name: string;
    categories: Array<Category>;
    menuServices: Array<MenuService>;

    constructor(
        id: number,
        name: string,
        categories: Array<Category>,
        menuServices: Array<MenuService>
    ) {
        this.id = id;
        this.name = name;
        this.categories = categories;
        this.menuServices = menuServices;
    }
}
