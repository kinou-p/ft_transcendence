import React, { useState, useEffect } from 'react';
import api from '../script/axiosApi.tsx';


const DoubleAuth = () => {
	// const [imageSrc, setImageSrc] = useState('');
	const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>('');
	useEffect(() => {
		async function getCode() {
			await api.get('/QRcode', { responseType: 'blob' })
				.then(response => {
					const reader = new FileReader();
					if (!reader)
						return;
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

	return (
		<div>
			<div>
				<p>Scan the QR code on your authenticator app</p>
				{/* {imageSrc && <img src={imageSrc} alt="QR Code" />} */}
				{imageSrc && <img src={imageSrc.toString()} alt="QR Code" />}</div>
		</div>
	);
};


export default DoubleAuth;