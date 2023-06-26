/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat.service.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/06/17 01:00:25 by apommier          #+#    #+#             */
/*   Updated: 2023/06/26 06:56:08 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conv } from '../model/chat.entity';
import { Message } from '../model/chat.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ChatService {
	constructor(@InjectRepository(Conv) private chatRepository: Repository<Conv>,
		@InjectRepository(Message) private messageRepository: Repository<Message>,
	) { }

	async save(conv: Conv): Promise<Conv> {
		return await this.chatRepository.save(conv);
	}

	async findAll(): Promise<Conv[]> {
		return await this.chatRepository.find();
	}

	async createConv(conv: Conv): Promise<Conv> {
		return await this.chatRepository.save(conv);
	}

	async getConv(username: string): Promise<Conv[]> {
		const convs = await this.chatRepository.query("SELECT * FROM \"conv\" WHERE $1 = ANY (ARRAY[members]);", [username])
		return convs;
	}

	async findConv(number: number) {
		const conv = await this.chatRepository.findOneBy({ id: number })
		return conv;
	}

	async createMessage(message: Message, username: string): Promise<Message> {
		const conv = await this.findConv(message.convid);
		if (conv.banned && conv.banned.find(item => item === username))
			return;
		if (conv.muted && conv.muted.find(item => item === username))
			return;
		return await this.messageRepository.save(message);
	}

	async isAllowed(convId: number, username: string) {
		const conv = await this.findConv(convId);
		if (conv.banned && conv.banned.find(item => item === username))
			return (0);
		if (conv.muted && conv.muted.find(item => item === username))
			return (0);
		return (1);
	}

	async getMessages(convId: number): Promise<Message[]> {
		const convs = await this.chatRepository
			.query("SELECT * FROM \"message\" WHERE $1 = message.convid;", [convId])

		return (convs)
	}

	async banUser(convId: number, username: string) {
		const conv = await this.findConv(convId);

		if (conv.owner === username)
			return (0);
		conv.banned = conv.banned || [];
		if (conv.banned.find(item => item === username)) {
			conv.banned = conv.banned.filter((item) => item !== username);
			this.save(conv);
			return (2);
		}
		conv.members = conv.members.filter((item) => item !== username);
		conv.banned.push(username);
		this.save(conv);
		return (1);
	}

	async inviteUser(convId: number, username: string) {
		const conv = await this.findConv(convId);

		if (conv.members.find(item => item === username))
			return (1);
		conv.members.push(username);
		this.save(conv);
	}



	async setPassword(convId: number, password: string) {
		const conv = await this.findConv(convId);
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		conv.password = hashedPassword
		this.save(conv);
	}

	// async verifyPassword(convId: number, password: string) {
	async verifyPassword(convId: number, password: string, username: string) {
		const conv = await this.findConv(convId);
		// return await bcrypt.compare(password, conv.password);
		const ret = await bcrypt.compare(password, conv.password);
		if (ret === true) {
			conv.members = conv.members || [];
			conv.members.push(username);
			this.save(conv);
		}
		return ret;
	}
yy

	async muteUser(convId: number, username: string, time: string) {
		const conv = await this.findConv(convId);
		const intTime = parseInt(time) * 1000;
		if (conv.owner === username)
			return (0);
		conv.muted = conv.muted || [];
		if (conv.muted.find(item => item === username))
			return (1);
		conv.muted.push(username);
		this.save(conv);

		setTimeout(() => {
			conv.muted = conv.muted.filter((item) => item !== username)
			this.save(conv);
		}, intTime);
	}

	async setAdmin(convId: number, username: string) {
		const conv = await this.findConv(convId);

		conv.admin = conv.admin || [];
		if (conv.admin.find(item => item === username))
			return (1);
		conv.admin.push(username);
		this.save(conv);
	}

	async isAdmin(convId: number, username: string) {
		const conv = await this.findConv(convId);

		conv.admin = conv.admin || [];
		if (conv.admin.find(item => item === username))
			return (1);
		console.log("nope");
		return (0);
	}

	async setPrivate(convId: number, bool: boolean) {
		const conv = await this.findConv(convId);
		console.log("bool= ", bool);
		conv.private = bool;
		this.save(conv);
	}

	async setName(convId: number, name: string) {
		const conv = await this.findConv(convId);
		conv.name = name;
		this.save(conv);
	}

	async joinChannel(convId: number, username: string) {
		const conv = await this.findConv(convId);
		conv.members = conv.members || [];
		if (conv.members.find(item => item === username))
			return;
		conv.members.push(username);
		this.save(conv);
	}

}
