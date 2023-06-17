/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat.service.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/17 01:00:25 by apommier          #+#    #+#             */
/*   Updated: 2023/06/17 01:48:15 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conv } from '../model/chat.entity';
import { Message } from '../model/chat.entity';

import { ArrayContains } from "typeorm"
import { query } from 'express';
import { InitializeOnPreviewAllowlist } from '@nestjs/core';

 
@Injectable()
export class ChatService {
 constructor(@InjectRepository(Conv) private chatRepository: Repository<Conv>,
 	@InjectRepository(Message) private messageRepository: Repository<Message>,
 ) {}
 
 async save(conv: Conv): Promise<Conv> {
	return await this.chatRepository.save(conv);
}

 async createConv(conv: Conv): Promise<Conv> {
	return await this.chatRepository.save(conv);
  }

  async getConv(username: string): Promise<Conv[]>{
	// username = "apommier"
	const convs = await this.chatRepository.query("SELECT * FROM \"conv\" WHERE $1 = ANY (ARRAY[members]);", [username])
	console.log(`convs= ${convs}`)
	return convs;
}

async findConv(number: number){
	// username = "apommier"
	console.log(`fincConv; ${number}`)
	const conv = await this.chatRepository.findOneBy({id: number})
	return conv;
}

 async createMessage(message: Message): Promise<Message> {
   return await this.messageRepository.save(message);
 }

 async getMessages(convId: number): Promise<Message[]> {
	const convs = await this.chatRepository
	.query("SELECT * FROM \"message\" WHERE $1 = message.convid;", [convId])
	
	return (convs)
}

async banUser(convId: number, username: string) {
	const conv = await this.findConv(convId);

	conv.banned = conv.banned || [];
	if (conv.banned.find(item => item === username))
			return (1);
	conv.banned.push(username);
	this.save(conv);
}

async inviteUser(convId: number, username: string) {
	// const conv = await this.findConv(convId);
	// this.save(conv);

	//find user
	//add in chanInvite chanID
	//save user
}

async setPassword(convId: number, password: string) {
	//verify is user is admin ?
	const conv = await this.findConv(convId);
	conv.password = password
	this.save(conv);
}

async muteUser(convId: number, username: string) {
	const conv = await this.findConv(convId);

	conv.muted = conv.muted || [];
	if (conv.muted.find(item => item === username))
		return (1);
	conv.muted.push(username);
	this.save(conv);
}

async setAdmin(convId: number, username: string) {
	const conv = await this.findConv(convId);

	conv.admin = conv.admin || [];
	if (conv.admin.find(item => item === username))
		return (1);
	conv.admin.push(username);
	this.save(conv);
}

async setPrivate(convId: number) {
	const conv = await this.findConv(convId);
	if (conv.private === true)
		conv.private = false;
	else
		conv.private = true;
	this.save(conv);
}

async setName(convId: number, name: string) {
	const conv = await this.findConv(convId);
	conv.name = name;
	this.save(conv);
}

}
