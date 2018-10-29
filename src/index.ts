import "reflect-metadata";

import { Container } from "typescript-ioc";

import Rechi from "./Rechi";

const app: Rechi = Container.get(Rechi);
app.start();