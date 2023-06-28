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
	sessionNumber: number;

	@Column({ default: 0 })
	gameSession: number;

	@Column({ default: 0 })
	rank: number;

	@Column({ default: 0 }) //0 = offline | 1 = connected | 2 = in game
	status: number;

	@Column({ default: 0 })
	userId: number;

	@Column('text', { array: true, nullable: true })
	friendRequest: string[];

	@Column({ type: 'jsonb', nullable: true })
	partyInvite: Record<string, string>[];

	@Column('text', { array: true, nullable: true })
	friends: string[];

	@Column('text', { array: true, nullable: true })
	blocked: string[];

	@OneToMany(() => MatchLog, (child) => child.parent, { eager: true })
	children: MatchLog[];

}

@Entity({name: 'MatchLog' })
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
