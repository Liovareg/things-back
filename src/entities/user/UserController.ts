import * as Router from "koa-router";
import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Logger from "../../common/Logger";
import { Delete, Get, Post, Put } from "../../common/RouteDecorators";
import User from "./User";
import API from "../../common/API";

@Singleton
export default class UserController extends API {
    constructor(@Inject private router: Router, @Inject private logger: Logger){
        super(router);
    }

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
            console.error('Error during findUserById', e);
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
            console.error('Error during saveUser', e);
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
            console.error('Error during updateUser', e);
            ctx.throw(400, e.message);
        }
    }

    @Delete('/users')
    public async deleteUser(ctx: IRouterContext) {
        try {
            await User.removeById(ctx.params.id);
            ctx.status = 204;
        } catch (e) {
            console.error('Error during deleteUser', e);
            ctx.status = 400;
        }
    }
}