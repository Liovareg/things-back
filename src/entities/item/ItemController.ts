import * as Router from 'koa-router';
import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import API from "../../common/API";
import Logger from "../../common/Logger";
import { Delete, Get, Post, Put } from "../../common/RouteDecorators";
import Item from "./Item";

@Singleton
export default class ItemController extends API{

    // constructor(router: Router, logger: Logger){
    constructor(@Inject private router: Router, @Inject private logger: Logger){
        super(router);
    }

    @Get('/items')
    public async getAllItems(ctx: IRouterContext) {
        ctx.body = await Item.find({user: ctx.state.user.id});
    }

    @Get('/items/:id')
    public async findItemById(ctx: IRouterContext) {
        try {
            ctx.body = await Item.findOneById(ctx.params.id);
        } catch (e) {
            this.logger.error('Error during findItemById');
            this.logger.error(e);
            ctx.throw(400);
        }
    }

    @Post('/items')
    public async saveItem(ctx: IRouterContext) {
        try {
            const item = Item.create(Object.assign({}, ctx.request.body, {user: ctx.state.user}));
            ctx.body = await item.save();
        } catch (e) {
            this.logger.error('Error during saveItem');
            this.logger.error(e);
            ctx.throw(400, e.message);
        }
    }

    @Put('/items:id')
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

    @Delete('/items:id')
    public async deleteItem(ctx: IRouterContext) {
        try {
            await Item.removeById(ctx.params.id);
            ctx.status = 204;
        } catch (e) {
            this.logger.error('Error during deleteItem');
            this.logger.error(e);
            ctx.status = 400;
        }
    }
}