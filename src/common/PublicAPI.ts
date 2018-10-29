import { BaseEntity } from "typeorm";

export abstract class PublicEntity extends BaseEntity {
    // abstract readonly PUBLIC_FIELDS: string[];
    [key: string]: any;

    public getPublic(): any {
        let api: any = {};

        this.PUBLIC_FIELDS.forEach((field: string) => {
            // this.constructor.prototype;
            api[field] = this[field];
        });

        return api;
    }
}

export function PublicFields(fields: string[]) {
    return (constructor: Function) => {
        constructor.prototype.PUBLIC_FIELDS = fields;
    }
}

