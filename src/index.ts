import "reflect-metadata";

import { Container } from "typescript-ioc";

import Things from "./Things";

const app: Things = Container.get(Things);
app.start();