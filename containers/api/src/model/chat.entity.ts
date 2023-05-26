import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
	
   @Entity()
	export class Chat{
	@PrimaryGeneratedColumn('uuid')
	id: number;
	
	@Column()
	email: string;
	
	@Column({ unique: true })
	text: string;
	
	@CreateDateColumn()
	createdAt: Date;

	//ban user
	//user list
	//blocked user (in user model ?)
	//op list
	//a way to stock conv ?
	
   }