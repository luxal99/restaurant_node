import express = require("express");
import bodyParser = require("body-parser");
import bcrypt = require("bcrypt");
import path = require('path');
import {Application, Request, Response} from "express";
import {UserService} from "./service/UserService";
import {User} from "./entity/User";
import {CategoryService} from "./service/CategoryService";
import {Category} from "./entity/Category";
import {ItemService} from "./service/ItemService";
import {Item} from "./entity/Item";
import * as firebase from "firebase";
import {Image} from "./entity/Image";
import {ImageService} from "./service/ImageService";
import {Message} from "./entity/Message";
import {MessageService} from "./service/MessageService";

const cors = require('cors');
let cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');

require('firebase/storage');

export class App {


    public app: Application;

    private userRouteName: string;
    private categoryRouteName: string;
    private menuItemRouteName: string;
    private messageRouteName: string;

    constructor(userRouteName: string, categoryRouteName: string, menuItemRouteName: string, messageRouteName: string) {


        this.app = express();

        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(bodyParser.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
        this.userRouteName = userRouteName;

        this.app.use(fileUpload())

        this.categoryRouteName = categoryRouteName;
        this.menuItemRouteName = menuItemRouteName;
        this.messageRouteName = messageRouteName;

        this.menuItemRoute();

        this.pageRoutes();
        this.userRoute();
        this.categoryRoute();
        this.messageRoute()

    }


    pageRoutes() {


        this.app.set('views', path.join(__dirname, '/pages'));

        this.app.use(cookieParser());
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(__dirname + '/public/assets'));
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));

        this.app.get('/', async (req: Request, res: Response) => {
            res.render('home', {items: await new ItemService().getAll()})
        });

        this.app.get('/login', (req: Request, res: Response) => {
            res.render('login')
        })


        this.app.get('/contact', (req: Request, res: Response) => {
            res.render('contact')
        })

        this.app.get('/menu', async (req: Request, res: Response) => {
            res.render('menu', {items: await new ItemService().getAll()})
        })

        this.app.get('/err', (req: Request, res: Response) => {
            res.render('error')
        })

        this.app.get('/admin', async (req: Request, res: Response) => {
            try {
                const user = await new UserService().findByName('admin');
                if (await bcrypt.compare(JSON.stringify(user.id), req.cookies.id))
                    res.render("admin", {
                        categories: await new CategoryService().getAll(),
                        cookie: req.cookies.id,
                        items: await new ItemService().getAll()
                    })

            } catch {
                res.render('login')
            }
        })


        this.app.get('/**', (req: Request, res: Response) => {
            res.render('404')
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
                    })
                    : res.sendStatus(403))

            } catch {
                res.render('error')
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
                res.render('error')
            }
        })

        this.app.get(`/${this.categoryRouteName}`, async (req: Request, res: Response) => {
            try {
                res.send(await new CategoryService().getAll());
            } catch {
                res.render('error')
            }
        })
    }

    menuItemRoute() {

        this.app.post(`/${this.menuItemRouteName}`, async (req: Request, res: Response) => {

            try {
                const image = req.files.image;
                await image.mv(`src/public/assets/uploads/${image.name}`, (err) => {
                });

                const imageEntity = new Image(`/uploads/${image.name}`);
                await new ImageService().save(imageEntity);

                await new ItemService().save(new Item(req.body.title, req.body.idCategory, req.body.description, imageEntity));

                res.render('admin', {
                    cookie: req.cookies.id,
                    categories: await new CategoryService().getAll(),
                    items: await new ItemService().getAll()
                });
            } catch {
                res.render('error')
            }


        })

        this.app.get(`/${this.menuItemRouteName}/delete/:id`, async (req: Request, res: Response) => {
            try {
                await new ItemService().delete(req.params.id);
                res.render('admin', {
                    cookie: req.cookies.id,
                    categories: await new CategoryService().getAll(),
                    items: await new ItemService().getAll()
                })
            } catch {
                res.render('error')
            }
        })
        this.app.get(`/${this.menuItemRouteName}`, async (req: Request, res: Response) => {
            try {
                res.send(await new ItemService().getAll());
            } catch {
                res.render('error')
            }
        })


        this.app.get(`/${this.menuItemRouteName}/:id`, async (req: Request, res: Response) => {
            try {
                let item = await new ItemService().findById(req.params.id)
                res.render('menu', {itemById: item, items: await new ItemService().getAll()});
            } catch {
                res.render('error')
            }
        })

        this.app.get(`/${this.menuItemRouteName}/byId/:id`, async (req: Request, res: Response) => {
            try {
                res.send(await new ItemService().findById(req.params.id))
            } catch {
                res.render('error')
            }
        })

        this.app.post(`/${this.menuItemRouteName}/update`, async (req: Request, res: Response) => {

            try {

                let item = new Item();
                let category = new Category();
                let image = new Image();

                category.id = Number.parseInt(req.body.idCategory);
                image.id = Number.parseInt(req.body.idImage);

                item.title = req.body.title;
                item.description = req.body.description;
                item.id = Number.parseInt(req.body.id);
                item.idCategory = category;
                item.idImage = image;

                if (req.files != null) {
                    const newImage = req.files.image;
                    await newImage.mv(`src/public/assets/uploads/${newImage.name}`, (err) => {
                    });

                    const img = new Image(`/uploads/${req.files.image.name}`);
                    await new ImageService().save(img);
                    item.idImage = img;
                }

                await new ItemService().update(item);
                res.render('admin', {
                    categories: await new CategoryService().getAll(),
                    items: await new ItemService().getAll()
                })
            } catch {
                res.render('error')
            }

        })
    }

    messageRoute() {
        this.app.post(`/${this.messageRouteName}`, async (req: Request, res: Response) => {
            try {
                const message = new Message();

                message.fullName = req.body.full_name;
                message.email = req.body.email;
                message.telephone = req.body.telephone;
                message.message = req.body.message;

                await new MessageService().save(message);

                res.render('home', {items: await new ItemService().getAll()})

            } catch {
                res.render('error')
            }
        })
    }
}
