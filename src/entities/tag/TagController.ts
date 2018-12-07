import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import API from "../../common/API";
import Logger from "../../common/Logger";
import { Delete, Get, Post, Put } from "../../common/RouteDecorators";
import { default as Item, default as Tag } from "./Tag";
import * as Router from 'koa-router';

@Singleton
export default class TagController extends API{

    constructor(@Inject private router: Router, @Inject private logger: Logger){
        super(router);
    }

    @Get('/tags')
    public async getAllTags(ctx: IRouterContext) {
        ctx.body = await Tag.find({user: ctx.state.user.id});
        // ctx.body = await Tag.find({where: {user: ctx.state.user.id}, relations: ['items']});
    }

    @Get('/tags/:id')
    public async findTagById(ctx: IRouterContext) {
        try {
            ctx.body = await Tag.findOneById(ctx.params.id);
        } catch (e) {
            this.logger.error('Error during findTagById');
            this.logger.error(e);
            ctx.throw(400);
        }
    }

    @Post('/tags')
    public async saveTag(ctx: IRouterContext) {
        try {
            const tag = Tag.create({...ctx.request.body, ...{user: ctx.state.user}});
            const itemIds = ctx.request.body.items;
            const items = itemIds.map((id: number) => { 
                const item = new Item();
                item.id = id;
                return item;
            })
            tag.items = items;
            ctx.body = await tag.save();
        } catch (e) {
            this.logger.error('Error during saveTag');
            this.logger.error(e);
            ctx.throw(400, e.message);
        }
    }

    @Put('/tags/:id')
    public async updateTag(ctx: IRouterContext) {
        try {
            let tag = await Tag.findOne({id: ctx.params.id, user: ctx.state.user.id})
            if (tag == undefined) {
                return undefined;
            }
            Object.assign(tag, ctx.request.body);
            ctx.body = await tag.save();
        } catch (e) {
            this.logger.error('Error during updateTag');
            this.logger.error(e);
            ctx.throw(400, e.message);
        }
    }

    @Delete('/tags')
    public async deleteTag(ctx: IRouterContext) {
        try {
            await Tag.removeById(ctx.params.id);
            ctx.status = 204;
        } catch (e) {
            this.logger.error('Error during deleteTag');
            this.logger.error(e);
            ctx.status = 400;
        }
    }
}