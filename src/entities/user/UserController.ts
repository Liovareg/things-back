import { Context } from "koa";
import { IMiddleware, IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import User from "./User";
import Logger from "../../common/Logger";
import { Get, Post, Put, Delete } from "src/common/RouteDecorators";

@Singleton
export default class UserController {
    @Inject private logger!: Logger;

    @Get('/users')
    public async getAllUsers(ctx: IRouterContext) {
        let users = await User.find();
        ctx.body = users.map(user => user.getPublic());
    }

    @Get('/users/:id')
    public async findUserById(ctx: IRouterContext) {
        try {
            ctx.body = await User.findOneById(ctx.params.id);
        } catch (e) {
            this.logger.error('Error during findUserById', e);
            ctx.throw(404);
        }
    }

    @Post('/users')
    public async saveUser(ctx: IRouterContext) {
        try {
            const user = User.create(ctx.request.body);
            user.hashPassword(ctx.request.body.password);
            ctx.body = await user.save();
        } catch (e) {
            this.logger.error('Error during saveUser', e);
            ctx.throw(400, e);
        }
    }

    @Put('/users/:id')
    public async updateUser(ctx: IRouterContext) {
        try {
            const user = await User.findOneById(ctx.params.id);
            if (user == undefined) {
                return undefined;
            }
            Object.assign(user, ctx.request.body);
            ctx.body = await user.save();
        } catch (e) {
            this.logger.error('Error during updateUser', e);
            ctx.throw(400, e.message);
        }
    }

    @Delete('/users')
    public async deleteUser(ctx: IRouterContext) {
        try {
            await User.removeById(ctx.params.id);
            ctx.status = 204;
        } catch (e) {
            this.logger.error('Error during deleteUser', e);
            ctx.status = 400;
        }
    }
}