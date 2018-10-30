import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Item from "./Item";
import Logger from "../../common/Logger";

@Singleton
export default class ItemController {

    @Inject private logger!: Logger;

    public async getAllItems(ctx: IRouterContext) {
        ctx.body = await Item.find();
    }

    public async findItemById(ctx: IRouterContext) {
        try {
            ctx.body = await Item.findOneById(ctx.params.id);
        } catch (e) {
            this.logger.error('Error during findItemById', e);
            ctx.throw(404);
        }
    }

    public async saveItem(ctx: IRouterContext) {
        try {
            const item = Item.create(ctx.request.body);
            ctx.body = await item.save();
        } catch (e) {
            this.logger.error('Error during saveItem', e);
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
        } catch (e) {
            this.logger.error('Error during updateItem', e);
            ctx.throw(400, e.message);
        }
    }

    public async deleteItem(ctx: IRouterContext) {
        try {
            await Item.removeById(ctx.params.id);
        } catch (e) {
            this.logger.error('Error during deleteItem', e);
            ctx.status = 200;
        }
    }
}