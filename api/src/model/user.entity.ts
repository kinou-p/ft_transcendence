// item.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
// import { BaseEntity } from './base.entity';

//   @Column({ type: 'varchar', length: 300 , nullable: true})
//   name: string;

//   @Column({ type: 'varchar', length: 300 , nullable: true})
//   description: string;
@Entity({ name: 'User' })
// export class User extends BaseEntity {
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	nickname: string;

	@Column({ nullable: true })
	username: string;

	@Column({ nullable: true })
	password: string;

	// @Column({ nullable: true })
	// email: string;

	// @Column({ nullable: true })
	// password: string;

	@Column({ default: 0 })
	win: number;

	@Column({ default: 0 })
	loss: number;

	@Column({ default: 0 })
	rank: number;

	@Column({ default: 0 })
	userId: number;
}