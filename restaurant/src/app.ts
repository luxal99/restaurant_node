import express = require("express");
import {Application, Request, Response} from "express";
import bodyParser = require("body-parser");

import path = require('path');

export class App {


    public app: Application;

    constructor() {


        this.app = express();
        this.pageRoutes();

        this.app.use(bodyParser.json());

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
}
