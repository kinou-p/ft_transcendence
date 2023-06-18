// import crypto from 'crypto';
import base32Decode from 'base32-decode';

import crypto from "crypto";
import * as OTPAuth from "otpauth";
import { encode } from "hi-base32";

import * as qr from 'qrcode';

// [...] Register user

// [...] Login user

// [...] Generate OTP

const generateRandomBase32 = async () => {
	const {randomBytes} = await import('crypto');
	const buffer = randomBytes(15);
	const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
	return base32;
  };
  
export const generateOTP = async (user) => {
	try {
	const base32_secret = await generateRandomBase32();
  
	let totp = new OTPAuth.TOTP({
		issuer: "Localhost",
		label: "OnlinePong",
		algorithm: "SHA1",
		digits: 6,
		period: 15,
		secret: base32_secret,
	});

	let otpauth_url = totp.toString();
	const qrCodeDataUrl = await qr.toDataURL(otpauth_url, { errorCorrectionLevel: 'H' });

	const filePath = 'qrcode.png'; // Specify the file path where the QR code should be saved
	
	qr.toFile(filePath, qrCodeDataUrl, (error) => {
	  if (error) {
		console.error(error);
		// Handle the error appropriately
		return;
	  }
	  // QR code image has been generated and saved to the file
	  // Or, you can create a buffer of the image data directly
	})






	const res = {
		otpauth_url: otpauth_url, 
		base32_secret: base32_secret
	}

	console.log("res= ", res)

	//update db with otp var
	user.otp_enabled = true;
	user.otp_base32 = base32_secret;
	return (res)

	} catch (error) {
		console.log(error)
	}
  };
  
  export const VerifyOTP = async (user, token: string) => {
	try {
	let totp = new OTPAuth.TOTP({
		issuer: "Localhost",
		label: "OnlinePong",
		algorithm: "SHA1",
		digits: 6,
		period: 15,
		secret: user.otp_base32,
	});
  
	  let delta = totp.validate({ token });

	  if (delta === null) {
		console.log("error verify token")
		return (0)
	  }
	  else
	  {
		user.otp_verified = true;
		console.log("token verified")
		return (1)
	  }
	} catch (error) {
		console.log(error)
	}
  };

  export const ValidateOTP = async (user, token: string) => {
	try {
	let totp = new OTPAuth.TOTP({
		issuer: "Localhost",
		label: "OnlinePong",
		algorithm: "SHA1",
		digits: 6,
		period: 15,
		secret: user.otp_base32,
	});
	  let delta = totp.validate({ token });

	  if (delta === null) {
		console.log("error validate token")
		return (0);
	  }
	  else
	  {
		// user.otp_verified = true;
		console.log("token validated")
		return (1);
	  }
	} catch (error) {
		console.log(error)
	}
  };

// import { randomBytes} from 'crypto';
// import { promisify } from 'util';

// export function generateHOTP(secret, counter) {
//   const decodedSecret = base32Decode(secret, 'RFC4648');

//   const buffer = Buffer.alloc(8);
//   for (let i = 0; i < 8; i++)
//   {
//     buffer[7 - i] = counter & 0xff;
//     counter = counter >> 8;
//   }

//   // Step 1: Generate an HMAC-SHA-1 value
//   const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret));
//   hmac.update(buffer);
//   const hmacResult = hmac.digest();

//   // Step 2: Generate a 4-byte string (Dynamic Truncation)
//   const offset = hmacResult[hmacResult.length - 1] & 0xf;
//   const code =
//     ((hmacResult[offset] & 0x7f) << 24) |
//     ((hmacResult[offset + 1] & 0xff) << 16) |
//     ((hmacResult[offset + 2] & 0xff) << 8) |
//     (hmacResult[offset + 3] & 0xff);

//   // Step 3: Compute an HOTP value
//   return `${code % 10 ** 6}`.padStart(6, '0');
// }

// type QRcode = any;

// export function generateHOTP(secret, counter) {
// 	const decodedSecret = base32Decode(secret, 'RFC4648');
  
// 	const buffer = Buffer.alloc(8);
// 	for (let i = 0; i < 8; i++) {
// 	  buffer[7 - i] = counter & 0xff;
// 	  counter = counter >> 8;
// 	}

// 	// Step 1: Generate an HMAC-SHA-1 value
// 	const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret));
// 	hmac.update(buffer);
// 	const hmacResult = hmac.digest();

// 	// Step 2: Generate a 4-byte string (Dynamic Truncation)
// 	const offset = hmacResult[hmacResult.length - 1] & 0xf;
// 	const code =
// 	  ((hmacResult[offset] & 0x7f) << 24) |
// 	  ((hmacResult[offset + 1] & 0xff) << 16) |
// 	  ((hmacResult[offset + 2] & 0xff) << 8) |
// 	  (hmacResult[offset + 3] & 0xff);
  
// 	// Step 3: Compute an HOTP value
// 	return code % 10 ** 6;
//   }

// export function generateTOTP(secret, window = 0)
// {
//   const counter = Math.floor(Date.now() / 30000);
//   return generateHOTP(secret, counter + window);
// }

// export function verifyTOTP(token, secret, window = 1)
// {
//   for (let errorWindow = -window; errorWindow <= +window; errorWindow++)
//   {
//     const totp = generateTOTP(secret, errorWindow);
//     if (token === totp)
//       return true;
//   }
//   return false;
// }



// import { initStorage, getUser, setUser } from './storage';
// import util from 'util';
// import qrcode from 'qrcode';
// // import base32Encode from 'base32-encode';
// import * as util from 'util';
// import * as qrcode from 'qrcode';
// import * as base32Encode from 'base32-encode';

// import * as util from 'util';
// import * as qrcode from 'qrcode';
// import * as crypto from 'crypto';
// import { Response } from 'express';
// import { Readable } from 'stream';
// import * as base32Encode from 'base32-encode';
// import { base32Encode } from 'base32-encode';
// import base32Encode from 'base32-encode';
// import { encode } from 'thirty-two';

// // ...

// import * as qrcode from 'qrcode';
// import * as fs from 'fs';


// import { nanoid } from "nanoid";
// // import * as nanoid from 'nanoid'

// export async function generateQRcode(req)
// {
// 	// const base32Encode = (await import('base32-encode'));
// 	// const nanoid = (await import('nanoid'));
	
// 	// const util = (await import('util'));
// 	// const qrcode = (await import('qrcode'));

// 	const user = req.user;
// 	let res;
// 	// For security, we no longer show the QR code after is verified
// 	// if (user.mfaEnabled) return res.status(404).end();
	
// 	// if (!user.mfaSecret) { //to do
// 	const buffer = nanoid(14);
// 	// generate unique secret for user
// 	// this secret will be used to check the verification code sent by user
// 	// const buffer = await util.promisify(crypto.randomBytes)(14);
// 	// const buffer = crypto.lib.WordArray.random(32)
// 	user.mfaSecret = encode(buffer).toString('utf8');
// 	//   user.mfaSecret = base32Encoded(buffer, 'RFC4648', { padding: false });
	
// 	  //   setUser(user); // to do !!


// 	// }
  
// 	const issuer = 'Google';
// 	const algorithm = 'SHA1';
// 	const digits = '6';
// 	const period = '30';
// 	const otpType = 'totp';
// 	const configUri = `otpauth://${otpType}/${issuer}:${user.username}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${user.mfaSecret}`;
  
// 	// res.setHeader('Content-Type', 'image/png');
// 	const QRCode = require('qrcode');
// 	console.log(`before done`);
// 	// QRCode.toFileStream(res, configUri);
// 	// const filePath = 'qrcode.png'; // Specify the file path where the QR code should be saved


// 	const qrCodeData = buffer; // Replace with your actual QR code data
// 	const filePath = 'qrcode.png'; // Specify the file path where the QR code should be saved
	
// 	qrcode.toFile(filePath, qrCodeData, (error) => {
// 	  if (error) {
// 		console.error(error);
// 		// Handle the error appropriately
// 		return;
// 	  }
// 	  // QR code image has been generated and saved to the file
// 	  // Or, you can create a buffer of the image data directly
// 	})

// // qrcode.toFile(filePath, configUri, (error) => {
// //   if (error) {
// //     console.error(error);
// //     // Handle the error appropriately
// //     return;
// //   }
// //   const readableStream = fs.createReadStream(filePath);
// //   res.data = readableStream;
//   // Use the readable stream as needed
// // });


	
// 	// qrcode.toFileStream(res, configUri);
// 	console.log(`QRcode done`);
// 	return res;
// 	// return
//   }