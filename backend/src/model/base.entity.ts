// // import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   nickName: string;

//   @Column()
//   Password: string;

//   @Column()
//   email: string;

//   @Column()
//   password: string;

//   @Column()
//   win: number;

//   @Column()
//   loose: number;

// //  friend
// //	joined chat
// //	jsp
// //	prout
// }

// base.entity.ts
import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	nickname: string;

	@Column({ nullable: true })
	password: string;

	@Column({ nullable: true })
	email: string;

	// @Column({ nullable: true })
	// password: string;

	@Column({ default: 0 })
	win: number;
	
	@Column({ default: 0 })
	loose: number;

	@Column({ default: 0 })
	rank: number;
}