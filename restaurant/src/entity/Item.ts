import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "./Category";
import {Image} from "./Image";

@Entity()
export class Item extends BaseEntity {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(type => Category, id => id.listOfItems)
    idCategory: Category

    @OneToOne(type => Image)
    @JoinColumn()
    idImage: Image;


    constructor(title: string, idCategory: Category, idImage: Image) {
        super();
        this.title = title;
        this.idCategory = idCategory;
        this.idImage = idImage;
    }
}
