import {EntityManager, getManager} from "typeorm";
import {Item} from "../entity/Item";

export class ItemService {


    protected manager: EntityManager;

    constructor() {
        this.manager = getManager();
    }

    async save(entity: Item): Promise<void> {
        await this.manager.save(entity);
    }

    async getAll(): Promise<Item[]> {
        return await this.manager.find(Item,{relations:['idCategory']});
    }

}