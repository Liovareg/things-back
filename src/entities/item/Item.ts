import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn} from "typeorm";
import User from "../user/User";

@Entity()
export default class Item extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({default: ''})
    imageUrl!: string;

    @OneToOne(type => User)
    @JoinColumn()
    user!: User
}