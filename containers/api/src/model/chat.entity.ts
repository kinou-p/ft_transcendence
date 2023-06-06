import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
	
   @Entity()
	export class Conv{
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text', { array: true, nullable: true })
	members: string[];

	@Column({ nullable: true })
    name: string

	@Column({ nullable: true })
    group: boolean

	// @Column()
	// members: string;// arry ??? one to many ???

	@Column({ nullable: true })
	banned: string;// arry ??? one to many ???

	@Column({ nullable: true })
	admin: string;// arry ??? one to many ???
	
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