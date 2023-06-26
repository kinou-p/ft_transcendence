import * as OTPAuth from "otpauth";
import { encode } from "hi-base32";
import * as qr from 'qrcode';

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

	const filePath = 'qrcode.png';
	
	qr.toFile(filePath, qrCodeDataUrl, (error) => {
	  if (error) {
		console.error(error);
		return;
	  }
	})

	const res = {
		otpauth_url: otpauth_url, 
		base32_secret: base32_secret
	}
	user.otp_enabled = true;
	user.otp_base32 = base32_secret;
	return (res);
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
		return (0)
	  }
	  else
	  {
		user.otp_verified = true;
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

	  if (delta === null)
		return (0);
	  else
		return (1);
	} catch (error) {
		console.log(error)
	}
  };