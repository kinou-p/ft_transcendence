// item.entity.ts
// import { BaseEntity } from './base.entity';

//   @Column({ type: 'varchar', length: 300 , nullable: true})
//   name: string;

//   @Column({ type: 'varchar', length: 300 , nullable: true})
//   description: string;


import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne, OneToMany } from 'typeorm';




@Entity({ name: 'User' })
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	// otp_enabled  Boolean @default(false)
	// otp_verified Boolean @default(false)

	@Column({ default: false })
	otp_enabled: boolean;

	@Column({ default: false })
	otp_verified: boolean;

	@Column({ nullable: true })
	otp_base32: string;

	@Column({ nullable: true })
	nickname: string;
	
	@Column({ nullable: true })
	username: string;

	@Column({ type: 'bytea', nullable: true })
	photo: Buffer;

	@Column({ nullable: true })
	password: string;

	@Column({ default: 0 })
	win: number;
	
	@Column({ default: 0 })
	loss: number;
	
	@Column({ default: 0 })
	rank: number;

	@Column({ default: 0 }) //0 = offline | 1 = connected | 2 = in game
	status: number;
	
	@Column({ default: 0 })
	userId: number;

	// @Column({ default: 0 })
	// doubleAuth: number;
	
	@Column('text', { array: true, nullable: true })
	friendRequest: string[];

	@Column('text', { array: true, nullable: true })
	friends: string[];

	@OneToMany(() => MatchLog, (child) => child.parent, { eager: true })
	children: MatchLog[];

}

@Entity()
export class MatchLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  opponent: string;

  @Column({ default: 0 })
  myScore: number;

  @Column({ default: 0 })
  opScore: number;

  @ManyToOne(() => User, parent => parent.children)
  parent: User;
}