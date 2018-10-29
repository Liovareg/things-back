import { IRouterContext } from "koa-router";
import { Container, Inject } from "typescript-ioc";
import ItemController from "./ItemController";
import Route from "../../common/Route";
import IRoutes from "../../common/IRoutes";

export default class ItemRoutes extends IRoutes {

    constructor( @Inject private itemController: ItemController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute("/items", "get", (ctx: IRouterContext) => this.itemController.getAllItems(ctx)),
            Route.newRoute("/items/:id", "get", (ctx: IRouterContext) => this.itemController.findItemById(ctx)),
            Route.newRoute("/items", "post", (ctx: IRouterContext) => this.itemController.saveItem(ctx)),
            Route.newRoute("/items/:id", "put", (ctx: IRouterContext) => this.itemController.updateItem(ctx)),
            Route.newRoute("/items/:id", "delete", (ctx: IRouterContext) => this.itemController.deleteItem(ctx)),
        ];
    }
}