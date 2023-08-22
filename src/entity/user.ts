// src/entity/User.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import bcrypt from "bcryptjs";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkPassword(rawPassword: string) {
        return bcrypt.compareSync(rawPassword, this.password);
    }
}
