import {EntityManager, getManager} from "typeorm";
import {User} from "../entity/User";

export class UserService {


    protected  manager: EntityManager;


    constructor() {

        this.manager = getManager();
    }

     async save(entity: User): Promise<void> {
        await this.manager.save(entity);
    }


}
