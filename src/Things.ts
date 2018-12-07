import * as cors from "@koa/cors";
import * as config from "config";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as jwt from "koa-jwt";
import * as koalogger from "koa-logger";
import * as Router from "koa-router";
import { createConnection } from "typeorm";
import { Inject } from "typescript-ioc";
import Item from "./entities/item/Item";
import ItemController from "./entities/item/ItemController";
import Tag from "./entities/tag/Tag";
import User from "./entities/user/User";
import AuthController from "./auth/AuthController";
import TagController from "./entities/tag/TagController";
import UserController from "./entities/user/UserController";

export default class Things {
    @Inject private app!: Koa;
    @Inject private router!: Router;
    @Inject private itemController!: AuthController;
    @Inject private authController!: ItemController;
    @Inject private tagController!: TagController;
    @Inject private userController!: UserController;
    // @Inject private logger!: Logger;


    private async initApp() {
        // https://pgweb-demo.herokuapp.com/#
        //  export DATABASE_URL=postgres://vnnpjqtzzeptqh:b221874fc9a1d8c6402bec60819d6556f6aa5f1438a164dc8417a43911f5b118@ec2-79-125-8-105.eu-west-1.compute.amazonaws.com:5432/dfu6ef3jibta49
        const connection = await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [
                Item, User, Tag
            ],
            extra: {
                ssl: true
            },
            synchronize: false,
            logging: false
        });

        this.authController;
        this.userController;
        this.itemController;
        this.tagController;

        this.app.use(cors());
        this.app.use(koalogger());
        this.app.use(jwt({ secret: config.get('jwtSecret') }).unless({ path: [/^\/auth/] }));
        this.app.use(bodyParser());
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());

        return this.app;
    };

    public async start() {
        const app = await this.initApp();
        const port = process.env.PORT || 5000;
        console.log(`Started listening on PORT ${port}...`);
        const server = app.listen(port);
        return Promise.resolve(server);
    }

}