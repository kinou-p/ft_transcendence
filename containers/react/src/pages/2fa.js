import React, { useCallback, useState, useEffect } from 'react';
import api from '../script/axiosApi';

function DoubleAuth() {

//   const enabled = await api.get("/2fa");

//   const response = await api.get("/2fa");
//   const enabled = response.data;
//   console.log(`enable= ${enabled.data}`)
	// const enabled = 0;
	let enabled;

	useEffect(() => {
		async function get2fa()
		{
			const response = await api.get("/2fa");
			  const enabled = response.data;
			  console.log(`enable= ${enabled.data}`)
		}
		// const enabled = 0;
	}, [])


//   const [verificationCode, setVerificationCode] = useState('');
//   const [invalidCode, setInvalidCode] = useState(false);

	const handleSubmit = () => {
    // async (e) => {
    //   e.preventDefault();

    //   const result = await verifyOtp(verificationCode);

    //   if (result) return (window.location = '/');

    //   setInvalidCode(true);
    // },
    // [verificationCode]
	};

	let sourceCode

	if (!enabled)
	{
		api.get('/QRcode')
  		.then(response => {
  		  sourceCode = response.data;
  		  console.log(sourceCode);
  		})
  		.catch(error => {
  		  console.error(error);
  		});
	}

  return (
    <div>
      {!enabled && (
        <div>
          <p>Scan the QR code on your authenticator app</p>
          <img src={sourceCode} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* <Input
          id="verificationCode"
          label="Verification code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        /> */}

        <button type="submit">Confirm</button>

        {/* {invalidCode && <p>Invalid verification code</p>} */}
      </form>
    </div>
  );
}

export default DoubleAuth;