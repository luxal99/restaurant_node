import {EntityManager, getManager} from "typeorm";
import {Message} from "../entity/Message";

export class MessageService {


    protected manager: EntityManager;

    constructor() {
        this.manager = getManager();
    }

    async save(entity: Message): Promise<void> {
        await this.manager.save(entity);
    }
}
