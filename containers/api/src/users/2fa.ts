import crypto from 'crypto';
import base32Decode from 'base32-decode';

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

type QRcode = any

export function generateHOTP(secret, counter) {
	const decodedSecret = base32Decode(secret, 'RFC4648');
  
	const buffer = Buffer.alloc(8);
	for (let i = 0; i < 8; i++) {
	  buffer[7 - i] = counter & 0xff;
	  counter = counter >> 8;
	}
  
	// Step 1: Generate an HMAC-SHA-1 value
	const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret));
	hmac.update(buffer);
	const hmacResult = hmac.digest();
  
	// Step 2: Generate a 4-byte string (Dynamic Truncation)
	const offset = hmacResult[hmacResult.length - 1] & 0xf;
	const code =
	  ((hmacResult[offset] & 0x7f) << 24) |
	  ((hmacResult[offset + 1] & 0xff) << 16) |
	  ((hmacResult[offset + 2] & 0xff) << 8) |
	  (hmacResult[offset + 3] & 0xff);
  
	// Step 3: Compute an HOTP value
	return code % 10 ** 6;
  }

export function generateTOTP(secret, window = 0)
{
  const counter = Math.floor(Date.now() / 30000);
  return generateHOTP(secret, counter + window);
}

export function verifyTOTP(token, secret, window = 1)
{
  for (let errorWindow = -window; errorWindow <= +window; errorWindow++)
  {
    const totp = generateTOTP(secret, errorWindow);
    if (token === totp)
      return true;
  }
  return false;
}



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

export async function generateQRcode(req)
{
	// const base32Encode = await import('base32-encode');
	const base32Encode = (await import('base32-encode'));
	const util = (await import('util'));
	const qrcode = (await import('qrcode'));
	const user = req.user;
	let res: QRcode;
	// For security, we no longer show the QR code after is verified
	// if (user.mfaEnabled) return res.status(404).end();
  
	// if (!user.mfaSecret) { //to do

	  // generate unique secret for user
	  // this secret will be used to check the verification code sent by user
	  const buffer = await util.promisify(crypto.randomBytes)(14);
	  user.mfaSecret = base32Encode(buffer, 'RFC4648', { padding: false });
	
	  //   setUser(user); // to do !!


	// }
  
	const issuer = 'Google';
	const algorithm = 'SHA1';
	const digits = '6';
	const period = '30';
	const otpType = 'totp';
	const configUri = `otpauth://${otpType}/${issuer}:${user.username}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${user.mfaSecret}`;
  
	// res.setHeader('Content-Type', 'image/png');
	
	qrcode.toFileStream(res, configUri);
	console.log(`QRcode done`);
	return res;
  }