import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Item} from "./Item";


@Entity()
export class Category extends BaseEntity {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(type => Item, listOfItems => listOfItems.idCategory)
    listOfItems: Item[];


    constructor(title?: string) {
        super();
        this.title = title;
    }
}
