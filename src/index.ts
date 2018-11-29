import * as Router from 'koa-router';
import "reflect-metadata";
import { Container, Scope } from "typescript-ioc";
import Things from "./Things";



Container.bind(Router).to(Router).scope(Scope.Singleton);

const app: Things = Container.get(Things);
app.start();