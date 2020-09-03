import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Image extends BaseEntity {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;


    constructor(url?: string) {
        super();
        this.url = url;
    }
}
