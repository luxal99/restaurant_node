import express = require("express");
import {Application, Request, Response} from "express";
import bodyParser = require("body-parser");

let cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');

require('firebase/storage');

import bcrypt = require("bcrypt");
import path = require('path');
import {UserService} from "./service/UserService";
import {User} from "./entity/User";
import {CategoryService} from "./service/CategoryService";
import {Category} from "./entity/Category";
import {ItemService} from "./service/ItemService";
import {Item} from "./entity/Item";
import * as firebase from "firebase";



export class App {


    public app: Application;

    private userRouteName: string;
    private categoryRouteName: string;
    private menuItemRouteName: string;

    constructor(userRouteName: string, categoryRouteName: string, menuItemRouteName: string) {


        this.app = express();

        this.app.use(fileUpload())
        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(bodyParser.json());

        this.userRouteName = userRouteName;
        this.categoryRouteName = categoryRouteName;
        this.menuItemRouteName = menuItemRouteName;

        this.pageRoutes();

        this.userRoute();
        this.categoryRoute();
        this.menuItemRoute();

    }

    pageRoutes() {


        this.app.set('views', path.join(__dirname, '/pages'));

        this.app.use(cookieParser());
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(__dirname + '/public/assets'));

        this.app.get('/', (req: Request, res: Response) => {
            res.render('home')

        });

        this.app.get('/login', (req: Request, res: Response) => {
            res.render('login')
        })

        
        this.app.get('/contact', (req: Request, res: Response) => {
            res.render('contact')
        })


    }

    userRoute() {
        this.app.post(`/${this.userRouteName}`, async (req: Request, res: Response) => {

            await new UserService().save(new User(req.body.username, await bcrypt.hash(req.body.password, 10)));
            res.sendStatus(200);

        })

        this.app.post(`/${this.userRouteName}/auth`, async (req: Request, res: Response) => {
            try {
                const user = await new UserService().findByName(req.body.username);

                const auth = ((user != null && await bcrypt.compare(req.body.password, user.password))
                    ? res.cookie("id", await bcrypt.hash(JSON.stringify(user.id), 10)) &&

                    res.render("admin", {
                        categories: await new CategoryService().getAll(),
                        cookie: req.cookies.id,
                        items: await new ItemService().getAll()
                    }) : res.sendStatus(403))

            } catch {
                res.sendStatus(500);
            }
        })
    }

    categoryRoute() {
        this.app.post(`/${this.categoryRouteName}`, async (req: Request, res: Response) => {
            try {
                await new CategoryService().save(new Category(req.body.title));
                res.render('admin', {
                    cookie: req.cookies.id,
                    categories: await new CategoryService().getAll(),
                    items: await new ItemService().getAll()
                })
            } catch {
                res.sendStatus(500);
            }
        })

        this.app.get(`/${this.categoryRouteName}`, async (req: Request, res: Response) => {
            try {
                res.send(await new CategoryService().getAll());
            } catch {
                res.sendStatus(500);
            }
        })
    }

    menuItemRoute() {
        this.app.post(`/${this.menuItemRouteName}`, async (req: Request, res: Response) => {

            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyAz8PX_PdPZo7WmWuxLYVMDiJUOozl0Fn4",
                    authDomain: "soy-smile-249718.firebaseapp.com",
                    databaseURL: "https://soy-smile-249718.firebaseio.com",
                    projectId: "soy-smile-249718",
                    storageBucket: "soy-smile-249718.appspot.com",
                    messagingSenderId: "870517553704",
                    appId: "1:870517553704:web:d238ce266071d519f8131d",
                    measurementId: "G-JGV7HTSL0B"
                }
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                const storageRef = firebase.storage().ref();

                const image = req.files.image;

                await storageRef.put(image).then(() => {
                        console.log("Uploaded")
                    }
                ).catch((error) => {
                    res.send(error)
                });

                await new ItemService().save(new Item(req.body.title, req.body.idCategory))
                res.render('admin', {
                    cookie: req.cookies.id,
                    categories: await new CategoryService().getAll(),
                    items: await new ItemService().getAll()
                });

            } catch (e) {
                res.send(e);
            }
        })

        this.app.get(`/${this.menuItemRouteName}`, async (req: Request, res: Response) => {
            res.send(await new ItemService().getAll());
        })

    }
}
