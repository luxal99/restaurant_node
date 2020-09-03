import {EntityManager, getConnection, getManager} from "typeorm";
import {Item} from "../entity/Item";

export class ItemService {


    protected manager: EntityManager;

    constructor() {
        this.manager = getManager();
    }

    async save(entity: Item): Promise<void> {
        await this.manager.save(entity);
    }

    async delete(id: number) {
        await this.manager.delete(Item, id);
    }

    async getAll(): Promise<Item[]> {
        return await this.manager.find(Item, {relations: ['idCategory', 'idImage']});
    }

    async findById(id: number): Promise<Item> {
        return await this.manager.findOne(Item, {id: id}, {relations: ['idCategory', 'idImage']});
    }

    async update(item: Item) {
        await getConnection()
            .createQueryBuilder()
            .update(Item)
            .set({
                title: item.title,
                description: item.description,
                idCategory: item.idCategory,
                idImage: item.idImage
            })
            .where("id = :id", {id: item.id})
            .execute();
    }

}
