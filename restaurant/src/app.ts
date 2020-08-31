import express = require("express");
import {Application, Request, Response} from "express";
import bodyParser = require("body-parser");
import bcrypt = require("bcrypt");
import path = require('path');
import {UserService} from "./service/UserService";
import {User} from "./entity/User";

export class App {


    public app: Application;

    private userRouteName: string;



    constructor(userRouteName: string) {


        this.app = express();
        this.app.use(bodyParser.json());

        this.userRouteName = userRouteName;
        this.pageRoutes();

        this.userRoute();

    }

    pageRoutes() {


        this.app.set('views', path.join(__dirname, '/pages'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(__dirname + '/public/assets'));

        this.app.get('/', (req: Request, res: Response) => {
            res.render('home')

        });

        this.app.get('/login', (req: Request, res: Response) => {
            res.render('login')
        })


    }

    userRoute() {
        this.app.post(`/${this.userRouteName}`, async (req: Request, res: Response) => {

                 await new UserService().save(new User(req.body.username,await bcrypt.hash(req.body.password,10)));
                res.sendStatus(200);

        })
    }
}
