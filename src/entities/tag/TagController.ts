import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Item from "./Tag";
import Logger from "../../common/Logger";
import Tag from "./Tag";

@Singleton
export default class TagController {

    @Inject private logger!: Logger;

    public async getAllTags(ctx: IRouterContext) {
        ctx.body = await Tag.find({user: ctx.state.user.id});
        // ctx.body = await Tag.find({where: {user: ctx.state.user.id}, relations: ['items']});
    }

    public async findTagById(ctx: IRouterContext) {
        try {
            ctx.body = await Tag.findOneById(ctx.params.id);
        } catch (e) {
            this.logger.error('Error during findTagById');
            this.logger.error(e);
            ctx.throw(400);
        }
    }

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
            console.log(tag)
            ctx.body = await tag.save();
        } catch (e) {
            this.logger.error('Error during saveTag');
            this.logger.error(e);
            ctx.throw(400, e.message);
        }
    }

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