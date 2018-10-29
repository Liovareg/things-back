import { IRouterContext } from "koa-router";
import { Container, Inject } from "typescript-ioc";
import AuthController from "./AuthController";
import Route from "../common/Route";
import IRoutes from "../common/IRoutes";

export default class UserRoutes extends IRoutes {

    constructor( @Inject private authController: AuthController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute("/auth", "post", (ctx: IRouterContext) => this.authController.authenticate(ctx)),
        ];
    }
}