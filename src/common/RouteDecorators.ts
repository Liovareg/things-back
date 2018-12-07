import * as Koa from 'koa';
import * as Router from 'koa-router';

interface Route {
    path: string | RegExp,
    methods: string[],
    middleware: Router.IMiddleware,
    opts?: Object
}

function routeBuilder(method: string, url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.constructor.prototype.routes = target.constructor.prototype.routes || []

        const route: Route = {
            methods: [method],
            path: url,
            middleware: async (ctx: Koa.Context, next: () => Promise<any>) => {
                console.log(`---> ${method} ${url}, params: ${JSON.stringify(ctx.params)}, body: ${JSON.stringify(ctx.request.body)}`);
                await descriptor.value.call(target, ctx);
                await next();
            },
        }

        target.constructor.prototype.routes.push(route);
    }
}

export function Get(url: string) {
    return routeBuilder('GET', url);
}

export function Post(url: string) {
    return routeBuilder('POST', url);
}

export function Put(url: string) {
    return routeBuilder('PUT', url);
}

export function Delete(url: string) {
    return routeBuilder('DELETE', url);
}