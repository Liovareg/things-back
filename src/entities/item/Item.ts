import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, JoinTable, ManyToMany} from "typeorm";
import User from "../user/User";
import Tag from "../tag/Tag";

@Entity()
export default class Item extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({default: ''})
    imageUrl!: string;

    @OneToOne(type => User)
    @JoinColumn()
    user!: User

    @ManyToMany(type => Tag, tag => tag.items)
    @JoinTable()
    tags!: Tag[]
}