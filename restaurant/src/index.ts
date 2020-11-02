import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {App} from "./app";
import {Category} from "./entity/Category";
import {Image} from "./entity/Image";
import {Item} from "./entity/Item";
import {Message} from "./entity/Message";



createConnection({
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "alemarc99",
    "database": "restaurant",
    "synchronize": true,
    "logging": false,
    "entities": [
    Category,
        Image,
        Item,
        Message,
        User
    ],
    "migrations": [
        "src/migration/**/*.ts"
    ],
    "subscribers": [
        "src/subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}).then(async () => {

}).catch(error => console.log(error));

const application = new App("user","category","item","message").app;
application.listen(3000,()=>{
    console.log("Listen on port")
})
