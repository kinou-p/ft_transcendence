export interface User {
	id: number;
	otp_enabled: boolean;
	otp_verified: boolean;
	otp_base32: string;
	nickname: string;
	username: string;
	photo: Buffer;
	password: string;
	win: number;
	loss: number;
	rank: number;
	status: number;
	userId: number;
	friendRequest: string[];
	partyInvite: Record<string, string>[];
	friends: string[];
	blocked: string[];
	sessionNumber: number;
	gameSession : number;
  }

export interface Conv {
	id: number;
	members?: string[];
	name: string
	group: boolean
	private: boolean
	banned?: string[];
	muted?: string[];
	admin?: string[];
	owner?: string;
	password?: string;
  }

export interface Message {
	id: number;
	convId: number;
 	sender: string;
 	text: string;
 	createdAt?: Date;
  }

export interface Matchlog {
	id: number;
  	opponent: string;
  	myScore: number;
  	opScore: number;
  	parent: User;
  }