/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat.entity.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/17 01:00:20 by apommier          #+#    #+#             */
/*   Updated: 2023/06/17 01:31:29 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
	
   @Entity()
	export class Conv{
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text', { array: true, nullable: true })
	members: string[];

	@Column({ default: "Unnamed Conv" })
    name: string

	@Column({ nullable: true })
    group: boolean

	@Column({ nullable: true })
    private: boolean

	// @Column()
	// members: string;// arry ??? one to many ???

	@Column('text', { array: true, nullable: true })
	banned: string[];

	@Column('text', { array: true, nullable: true })
	muted: string[];

	@Column('text', { array: true, nullable: true })
	admin: string[];

	@Column({ nullable: true })
	owner: string;

	@Column({ nullable: true })
	password: string;
	
	@Column({ nullable: true })
	messages: string;
	 
	// @CreateDateColumn()
	// createdAt: Date;



	//ban user
	//user list
	//blocked user (in user model ?)
	//op list
	//a way to stock conv ?
	
   }

   @Entity()
   export class Message{
   @PrimaryGeneratedColumn()
   id: number;
   
   @Column({nullable: true})
   convid: number;

   @Column()
   sender: string;

   @Column()
   text: string;
   

   @CreateDateColumn({ nullable: true })
   createdAt?: Date;
   
  }