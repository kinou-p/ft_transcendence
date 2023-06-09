// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ConvService {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conv } from '../model/chat.entity';
import { Message } from '../model/chat.entity';

import { ArrayContains } from "typeorm"
import { query } from 'express';

 
@Injectable()
export class ChatService {
 constructor(@InjectRepository(Conv) private chatRepository: Repository<Conv>,
 	@InjectRepository(Message) private messageRepository: Repository<Message>,
 ) {}
 
 async createConv(conv: Conv): Promise<Conv> {
	return await this.chatRepository.save(conv);
  }

  
 
//   SELECT "conv"."id" AS "conv_id", "conv"."members" AS "conv_members", "conv"."name" AS "conv_name", "conv"."banned" AS "conv_banned", "conv"."admin" AS "conv_admin", "conv"."messages" AS "conv_messages" FROM "conv" "conv" WHERE $1 = ANY("conv"."members")
 
 
//  import { createConnection } from 'typeorm';
 
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

// Usage
// const user = 'user1';
// findConvsContainingUser(user)
//   .then((convs) => {
//     console.log('Convs containing user:', convs);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
	  // return await this.chatRepository.findOneBy({
		  // 	members: { $in: [username] },
		  //   });
		  
		//   return await this.chatRepository.find()


	// return await this.chatRepository.findOneBy({
	// 	members: ArrayContains(["apommier"]),
	// })

	// console.log(`get conv username= ${username} `)
	// let test =  await this.chatRepository.find({
	// 	where : {
	// 		members: { $all: ["apommier"] },
	// }})
	// console.log(`test= ${test}`)
	// return test
//   }





//
// message
//

 async createMessage(message: Message): Promise<Message> {
   return await this.messageRepository.save(message);
 }

 async getMessages(convId: number): Promise<Message[]> {
//    return await this.messageRepository.find({
// 		where: {
// 			convId: convId,
// 		},
// 	});
	const convs = await this.chatRepository
	.query("SELECT * FROM \"message\" WHERE $1 = message.convid;", [convId])
	
	return (convs)
}
}
