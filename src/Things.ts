import * as Koa from "koa"
import * as Router from "koa-router"
import * as koalogger from "koa-logger"
import { createConnection, DatabaseType } from "typeorm";
import * as bodyParser from "koa-bodyparser"
import * as config from "config";
import * as jwt from "koa-jwt";

import { Inject } from "typescript-ioc";
import * as cors from "@koa/cors"
import ItemRoutes from "./entities/item/ItemRoutes";
import Item from "./entities/item/Item";
import User from "./entities/user/User";
import UserRoutes from "./entities/user/UserRoutes";
import AuthRoutes from "./auth/AuthRoutes";
import Logger from "./common/Logger";
import TagRoutes from "./entities/tag/TagRoutes";
import Tag from "./entities/tag/Tag";

export default class Things {
    @Inject private itemRoutes!: ItemRoutes;
    @Inject private userRoutes!: UserRoutes;
    @Inject private authRoutes!: AuthRoutes;
    @Inject private tagRoutes!: TagRoutes;
    @Inject private logger!: Logger;

    private async initApp() {
        //  export DATABASE_URL=postgres://vnnpjqtzzeptqh:b221874fc9a1d8c6402bec60819d6556f6aa5f1438a164dc8417a43911f5b118@ec2-79-125-8-105.eu-west-1.compute.amazonaws.com:5432/dfu6ef3jibta49
        await createConnection({
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

        const app: Koa = new Koa();
        const router: Router = new Router();

        this.itemRoutes.register(router);
        this.userRoutes.register(router);
        this.authRoutes.register(router);
        this.tagRoutes.register(router);

        app.use(cors());
        app.use(koalogger());
        app.use(jwt({ secret: config.get('jwtSecret') }).unless({ path: [/^\/auth/] }));
        app.use(bodyParser());
        app.use(router.routes());
        app.use(router.allowedMethods());

        return app;
    };

    public async start() {
        const app = await this.initApp();
        const port = process.env.PORT || 3000;
        console.log(`Started listening on PORT ${port}...`);
        const server = app.listen(port);
        return Promise.resolve(server);
    }

}