import { Context } from "koa";
import { IMiddleware, IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Item from "./Item";

@Singleton
export default class ItemController {

    constructor() { }

    public async getAllItems(ctx: IRouterContext) {
        ctx.body = await Item.find();
    }

    public async findItemById(ctx: IRouterContext) {
        try {
            ctx.body = await Item.findOneById(ctx.params.id);
        } catch (e) {
            ctx.throw(404);
        }
    }

    public async saveItem(ctx: IRouterContext) {
        try {
            const item = Item.create(ctx.request.body);
            ctx.body = await item.save();
        } catch (e) {
            ctx.throw(400, e.message);
        }
    }

    public async updateItem(ctx: IRouterContext) {
        try {
            const item = await Item.findOneById(ctx.params.id);
            if (item == undefined) {
                return undefined;
            }
            Object.assign(item, ctx.request.body);
            ctx.body = await item.save();
            // return await Item.updateById(ctx.request.body, ctx.params.id)
        } catch (e) {
            ctx.throw(400, e.message);
        }
    }

    public async deleteItem(ctx: IRouterContext) {
        await Item.removeById(ctx.params.id);
        ctx.status = 200;
    }
}