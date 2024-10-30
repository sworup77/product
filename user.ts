import { Entity , PrimaryGeneratedColumn, Column } from "typeorm";
 
@Entity()
 export class user {
id : number;

@Column()
firstname: string;

 @Column()
 lastname: string;

 @Column()
 email: string;
 }