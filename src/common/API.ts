import { Middleware, Context } from "koa";
import * as Router from 'koa-router';
import { Inject } from "typescript-ioc";

interface Route {
    path: string | RegExp, methods: string[], middleware: Router.IMiddleware, opts?: Object
}

export default class API {
    private routes!: Route[];

    constructor(router: Router) {
        for (let route of this.routes) {
            router.register(route.path, route.methods, route.middleware, route.opts)
        }
    }
}