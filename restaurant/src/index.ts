import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {App} from "./app";



createConnection().then(async connection => {

}).catch(error => console.log(error));

const application = new App().app;
application.listen(3000,()=>{
    console.log("Listen on port")
})
