import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Category extends BaseEntity {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;


    constructor(title: string) {
        super();
        this.title = title;
    }
}
