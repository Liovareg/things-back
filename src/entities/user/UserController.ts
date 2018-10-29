import { Context } from "koa";
import { IMiddleware, IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import User from "./User";

@Singleton
export default class UserController {

    constructor() { }

    public async getAllUsers(ctx: IRouterContext) {
        let users = await User.find();
        ctx.body = users.map(user => user.getPublic());
    }

    public async findUserById(ctx: IRouterContext) {
        try {
            ctx.body = await User.findOneById(ctx.params.id);
        } catch (e) {
            ctx.throw(404);
        }
    }

    public async saveUser(ctx: IRouterContext) {
        try {
            const user = User.create(ctx.request.body);
            user.hashPassword(ctx.request.body.password);
            ctx.body = await user.save();
        } catch (e) {
            ctx.throw(400, e.message);
        }
    }

    public async updateUser(ctx: IRouterContext) {
        try {
            const user = await User.findOneById(ctx.params.id);
            if (user == undefined) {
                return undefined;
            }
            Object.assign(user, ctx.request.body);
            ctx.body = await user.save();
        } catch (e) {
            ctx.throw(400, e.message);
        }
    }

    public async deleteUser(ctx: IRouterContext) {
        await User.removeById(ctx.params.id);
        ctx.status = 200;
    }
}