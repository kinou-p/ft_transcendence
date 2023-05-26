import React, { useCallback, useState, useEffect } from 'react';
import api from '../script/axiosApi';

// function DoubleAuth() {

// //   const enabled = await api.get("/2fa");

// //   const response = await api.get("/2fa");
// //   const enabled = response.data;
// //   console.log(`enable= ${enabled.data}`)
// 	// const enabled = 0;
// 	let enabled;

// 	useEffect(() => {
// 		async function get2fa()
// 		{
// 			const response = await api.get("/2fa");
// 			  const enabled = response.data;
// 			  console.log(`enable= ${enabled.data}`)
// 		}
// 		// const enabled = 0;
// 	}, [])


	  
	// useEffect(() => {
	// async function get2fa()
	// {
	// 	api.get('/api/QRcode', { responseType: 'blob' })
	// 	  .then(response => {
	// 		const reader = new FileReader();
	// 		reader.onloadend = () => {
	// 		  setImageSrc(reader.result);
	// 		};
	// 		reader.readAsDataURL(response.data);
	// 	  })
	// 	  .catch(error => {
	// 		console.error(error);
	// 	  });
	
  	// }  }, []);

// //   const [verificationCode, setVerificationCode] = useState('');
// //   const [invalidCode, setInvalidCode] = useState(false);

// 	const handleSubmit = () => {
//     // async (e) => {
//     //   e.preventDefault();

//     //   const result = await verifyOtp(verificationCode);

//     //   if (result) return (window.location = '/');

//     //   setInvalidCode(true);
//     // },
//     // [verificationCode]
// 	};

// 	let sourceCode

// 	if (!enabled)
// 	{
// 		api.get('/QRcode')
//   		.then(response => {
//   		  sourceCode = response.data;
//   		  console.log(sourceCode);
//   		})
//   		.catch(error => {
//   		  console.error(error);
//   		});
// 	}

//   return (
//     <div>
//       {!enabled && (
//         <div>
//           <p>Scan the QR code on your authenticator app</p>
//           <img src={sourceCode} />
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* <Input
//           id="verificationCode"
//           label="Verification code"
//           type="text"
//           value={verificationCode}
//           onChange={(e) => setVerificationCode(e.target.value)}
//         /> */}

//         <button type="submit">Confirm</button>

//         {/* {invalidCode && <p>Invalid verification code</p>} */}
//       </form>
//     </div>
//   );
// }


// import { toFileStream } from 'qrcode';

const DoubleAuth = () => {
	const [imageSrc, setImageSrc] = useState('');
  
	useEffect(() => {
		async function getCode(){
		await api.get('/QRcode', { responseType: 'blob' })
		.then(response => {
		  const reader = new FileReader();
		  reader.onloadend = () => {
			setImageSrc(reader.result);
		  };
		  reader.readAsDataURL(response.data);
		})
		.catch(error => {
		  console.error(error);
		});
	}
	getCode();
}, []);
  
	// return (
	//   <div>
	// 	{imageSrc && <img src={imageSrc} alt="QR Code" />}
	//   </div>
	// );

	// <img src={sourceCode} />

	return (
		<div>
			<div>
			  <p>Scan the QR code on your authenticator app</p>
			  {imageSrc && <img src={imageSrc} alt="QR Code" />}
			</div>
			{/* <form onSubmit={handleSubmit}>
				<button type="submit">Confirm</button>
  			</form> */}
		</div>
	  );


  };


  export default DoubleAuth;