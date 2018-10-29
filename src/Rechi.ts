import * as Koa from "koa"
import * as Router from "koa-router"
import * as logger from "koa-logger"
import { createConnection, DatabaseType } from "typeorm";
import * as bodyParser from "koa-bodyparser"
import * as config from "config";
import * as jwt from "koa-jwt";

import { Inject } from "typescript-ioc";
import * as cors from "koa2-cors"
import ItemRoutes from "./entities/item/ItemRoutes";
import Item from "./entities/item/Item";
import User from "./entities/user/User";
import UserRoutes from "./entities/user/UserRoutes";
import AuthRoutes from "./auth/AuthRoutes";

export default class Rechi {

    constructor(
        @Inject private itemRoutes: ItemRoutes,
        @Inject private userRoutes: UserRoutes,
        @Inject private authRoutes: AuthRoutes
    ) { }

    private async initApp() {
        const type: DatabaseType = "postgres";
        const configType: DatabaseType = config.get<DatabaseType>('db.type') as DatabaseType;

        await createConnection(
            {
                type: type,
                host: config.get('db.host'),
                port: config.get('db.port'),
                username: config.get('db.username'),
                password: config.get('db.password'),
                database: config.get('db.database'),
                schema: config.get('db.schema'),
                entities: [
                    Item, User
                ],
                extra: {
                    ssl: true
                },
                synchronize: true,
                logging: false
            })

        const app: Koa = new Koa();
        const router: Router = new Router();

        this.itemRoutes.register(router);
        this.userRoutes.register(router);
        this.authRoutes.register(router);

        app.use(cors());
        app.use(logger());
        app.use(jwt({ secret: config.get('jwtSecret') }).unless({ path: [/^\/auth/] }));
        app.use(bodyParser());
        app.use(router.routes());
        app.use(router.allowedMethods());

        return Promise.resolve(app);
    };

    public async start() {
        const app = await this.initApp();
        const port = process.env.PORT || 3000;
        console.log(`Started listening on port ${port}...`);
        const server = app.listen(port);
        return Promise.resolve(server);
    }

}