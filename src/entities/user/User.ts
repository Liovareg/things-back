import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { hash, compare, genSaltSync } from "bcryptjs";
import { PublicEntity, PublicFields } from "../../common/PublicAPI"
import Tag from "../tag/Tag";

@Entity()
@PublicFields(['id', 'email', 'name'])
export default class User extends PublicEntity {

    constructor() {
        super();
        this.salt = genSaltSync(10);
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column({default: ''})
    name!: string;

    @OneToMany(type => Tag, tag => tag.user)
    tags!: Tag[];

    @Column()
    private hash!: string;

    @Column()
    private salt: string;

    [key: string]: any;

    public async isPasswordCorrect(password: string): Promise<boolean> {
        return compare(password, this.hash);
    }

    public async hashPassword(password: string) {
        try {
            this.hash = await hash(password, this.salt);
        } catch (e) {
            console.error('Error hashing password', e);
        }
    }
}