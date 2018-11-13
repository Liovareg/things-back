import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Item from "./Item";
import Logger from "../../common/Logger";

@Singleton
export default class ItemController {

    @Inject private logger!: Logger;

    public async getAllItems(ctx: IRouterContext) {
        ctx.body = await Item.find({user: ctx.state.user.id});
    }

    public async findItemById(ctx: IRouterContext) {
        try {
            ctx.body = await Item.findOneById(ctx.params.id);
        } catch (e) {
            this.logger.error('Error during findItemById');
            this.logger.error(e);
            ctx.throw(400);
        }
    }

    public async saveItem(ctx: IRouterContext) {
        try {
            const item = Item.create(Object.assign({}, ctx.request.body, {user: ctx.state.user.id}));
            console.log('Saving item', item)
            ctx.body = await item.save();
        } catch (e) {
            this.logger.error('Error during saveItem');
            this.logger.error(e);
            ctx.throw(400, e.message);
        }
    }

    public async updateItem(ctx: IRouterContext) {
        try {
            const item = await  Item.findOne({id: ctx.params.id, user: ctx.state.user.id})
            if (item == undefined) {
                return undefined;
            }
            Object.assign(item, ctx.request.body);
            ctx.body = await item.save();
        } catch (e) {
            this.logger.error('Error during updateItem');
            this.logger.error(e);
            ctx.throw(400, e.message);
        }
    }

    public async deleteItem(ctx: IRouterContext) {
        try {
            await Item.removeById(ctx.params.id);
            ctx.status = 200;
        } catch (e) {
            this.logger.error('Error during deleteItem');
            this.logger.error(e);
            ctx.status = 400;
        }
    }
}