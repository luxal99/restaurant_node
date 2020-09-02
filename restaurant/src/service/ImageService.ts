import {EntityManager, getManager} from "typeorm";
import {Item} from "../entity/Item";
import {Image} from "../entity/Image";

export class ImageService {

    protected manager: EntityManager;

    constructor() {
        this.manager = getManager();
    }

    async save(entity: Image): Promise<void> {
        await this.manager.save(entity);
    }

}
