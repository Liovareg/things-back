import * as Router from "koa-router";
import Route from "../common/Route";
import { Inject } from "typescript-ioc";
import Logger from "./Logger";

export default abstract class IRoutes {

    @Inject private logger!: Logger

    protected abstract getRoutes(): Route[];

    public register(router: Router) {
        this.getRoutes().forEach((route) => {
            this.registerRoute(route, router);
        });
    }

    private registerRoute = (route: Route, router: Router) => {
        this.logger.info(`Registering route ${route.$method.toUpperCase()} ${route.$path}`);
        
        switch (route.$method) {
            case ("get"):
                router.get(route.$path, route.$action);
                break;
            case ("post"):
                router.post(route.$path, route.$action);
                break;
            case ("put"):
                router.put(route.$path, route.$action);
                break;
            case ("delete"):
                router.delete(route.$path, route.$action);
                break;
        }
    }

}