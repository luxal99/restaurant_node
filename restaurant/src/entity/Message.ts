import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Message {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column()
    telephone: string

    @Column({length: 1024})
    message: string


    constructor() {
    }
}
