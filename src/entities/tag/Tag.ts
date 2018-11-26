import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Item from "../item/Item";
import User from "../user/User";

@Entity()
export default class Tag extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @Column()
    description!: string;

    @Column()
    color!: string;

    @ManyToMany(type => Item, item => item.tags,  {
        lazy: true
    })
    items!: Item[]

    @ManyToOne(type => User, user => user.tags)
    user!: User
}