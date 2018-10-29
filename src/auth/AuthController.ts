import { Context } from "koa";
import { IMiddleware, IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import User from "../entities/user/User";
import * as jwt from "jsonwebtoken";
import * as config from "config";

@Singleton
export default class AuthController {

    constructor() { }

    public async authenticate(ctx: IRouterContext) {
        try {
            let user = await User.findOne({ email: ctx.request.body.email });
            if (!user) {
                return ctx.status = 401;
            }

            let isPassCorrect = await user.isPasswordCorrect(ctx.request.body.password);

            if (isPassCorrect) {
                const publicUser = user.getPublic();
                ctx.body = user.getPublic();
                ctx.body.token = jwt.sign(publicUser, config.get('jwtSecret'));
            } else {
                return ctx.status = 401;
            }
        } catch (e) {
            console.log('Error during authenticate', e);
            ctx.throw(404);
        }
    }
}