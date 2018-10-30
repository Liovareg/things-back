import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { hash, compare, genSaltSync } from "bcryptjs";
import { PublicEntity, PublicFields } from "../../common/PublicAPI"

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

    @Column()
    private hash!: string;

    @Column()
    private salt: string;

    [key: string]: any;

    public async isPasswordCorrect(password: string): Promise<boolean> {
        return await compare(password, this.hash);
    }

    public async hashPassword(password: string) {
        try {
            this.hash = await hash(password, this.salt);
        } catch (e) {
            console.error('Error hashing password', e);
        }
    }
}