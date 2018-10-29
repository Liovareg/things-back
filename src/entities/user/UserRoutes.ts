import { IRouterContext } from "koa-router";
import { Container, Inject } from "typescript-ioc";
import UserController from "./UserController";
import Route from "../../common/Route";
import IRoutes from "../../common/IRoutes";

export default class UserRoutes extends IRoutes {

    constructor( @Inject private userController: UserController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute("/users", "get", (ctx: IRouterContext) => this.userController.getAllUsers(ctx)),
            Route.newRoute("/users/:id", "get", (ctx: IRouterContext) => this.userController.findUserById(ctx)),
            Route.newRoute("/users", "post", (ctx: IRouterContext) => this.userController.saveUser(ctx)),
            Route.newRoute("/users/:id", "put", (ctx: IRouterContext) => this.userController.updateUser(ctx)),
            Route.newRoute("/users/:id", "delete", (ctx: IRouterContext) => this.userController.deleteUser(ctx)),
        ];
    }
}