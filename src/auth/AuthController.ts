import * as config from "config";
import * as jwt from "jsonwebtoken";
import * as Router from 'koa-router';
import { IRouterContext } from "koa-router";
import { Post } from "../common/RouteDecorators";
import { Inject, Singleton } from "typescript-ioc";
import Logger from "../common/Logger";
import User from "../entities/user/User";
import API from "../common/API";

@Singleton
export default class AuthController extends API {

    constructor(@Inject private router: Router, @Inject private logger: Logger) {
        super(router);
    }

    private async authenticate(user: User, password: string): Promise<string | undefined> {
        return password && await user.isPasswordCorrect(password) ?
            jwt.sign(user.getPublic(), config.get('jwtSecret')) : undefined;
    }

    @Post('/auth/signin')
    public async signin(ctx: IRouterContext) {
        try {
            let user = await User.findOne({ email: ctx.request.body.email });
            if (!user) {
                return ctx.status = 401;
            }

            const token = await this.authenticate(user, ctx.request.body.password);

            if (token) {
                ctx.body = user.getPublic();
                ctx.body.token = token;
            } else {
                return ctx.status = 401;
            }
        } catch (e) {
            this.logger.error('Error during signin');
            this.logger.error(e);

            ctx.throw(404);
        }
    }

    @Post('/auth/signup')
    public async signup(ctx: IRouterContext) {
        try {
            let user = User.create(ctx.request.body);
            user.hashPassword(ctx.request.body.password);
            user = await user.save();

            ctx.body = user.getPublic();
            ctx.body.token = await this.authenticate(user, ctx.request.body.password)
        } catch (e) {
            this.logger.error('Error during signup');
            this.logger.error(e);
            ctx.throw(400, e);
        }
    }
}