import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
	
   @Entity()
//    export class Chat extends BaseEntity {
	export class Chat{
	@PrimaryGeneratedColumn('uuid')
	id: number;
	
	@Column()
	email: string;
	
	@Column({ unique: true })
	text: string;
	
	@CreateDateColumn()
	createdAt: Date;

	
   }