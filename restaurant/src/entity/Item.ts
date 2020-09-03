import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "./Category";
import {Image} from "./Image";

@Entity()
export class Item extends BaseEntity {


    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({length: 1024})
    description: string

    @ManyToOne(type => Category, id => id.listOfItems)
    idCategory: Category

    @OneToOne(type => Image)
    @JoinColumn()
    idImage: Image;


    constructor(title: string, idCategory: Category, description: string, idImage: Image) {
        super();
        this.title = title;
        this.idCategory = idCategory;
        this.idImage = idImage;
        this.description = description;
    }
}
