import { IRouterContext } from "koa-router";
import { Inject } from "typescript-ioc";
import IRoutes from "../../common/IRoutes";
import Route from "../../common/Route";
import TagController from "./TagController";

export default class TagRoutes extends IRoutes {

    constructor( @Inject private itemController: TagController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute("/tags", "get", (ctx: IRouterContext) => this.itemController.getAllTags(ctx)),
            Route.newRoute("/tags/:id", "get", (ctx: IRouterContext) => this.itemController.findTagById(ctx)),
            Route.newRoute("/tags", "post", (ctx: IRouterContext) => this.itemController.saveTag(ctx)),
            Route.newRoute("/tags/:id", "put", (ctx: IRouterContext) => this.itemController.updateTag(ctx)),
            Route.newRoute("/tags/:id", "delete", (ctx: IRouterContext) => this.itemController.deleteTag(ctx)),
        ];
    }
}