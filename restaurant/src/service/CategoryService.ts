import {EntityManager, getManager} from "typeorm";
import {Category} from "../entity/Category";

export class CategoryService {


    protected manager: EntityManager;

    constructor() {
        this.manager = getManager();
    }

    async save(entity: Category): Promise<void> {
        await this.manager.save(entity);
    }

    async getAll(): Promise<Category[]> {
        return await this.manager.find(Category);
    }

}
