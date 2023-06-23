import { useEffect } from 'react';
// import { useState, useRef } from 'react';
import DrawCanvas from './canvas.tsx';
import queryString from 'query-string';
import '../styles/field.css';

import { useParams } from "react-router-dom";
import React from 'react';

// import { withRouter } from 'react-router-dom';

interface GameProps {
	privateParty: boolean,
	username?: string
	gameId?: number
}

function Field()
{
	useEffect(() => {
		// const location = useLocation();
		const queryParams = queryString.parse(window.location.search);
		
		console.log("launch canva hehe")
		let Modifiers = 0;
		let info: GameProps;

		if (queryParams.superpower === 'true') {
		  Modifiers += 1;
		}
	  
		if (queryParams.obstacle === 'true') {
		  Modifiers += 2;
		}
	  
		if (queryParams.speed === 'true') {
		  Modifiers += 4;
		}
		
		info = {
			privateParty: false,
			
		}
		if (queryParams.username)
		{
				console.log("user= ", queryParams.username)
				info = {
					privateParty: true,
					username: queryParams.username as string,
					gameId: queryParams.gameId as unknown as number
				}
			console.log("info of param vefore canvas=", info)
		}

		const cleanup = DrawCanvas(Modifiers, info);
	
		return () => {
		  console.log("Cleanup");
		//   cleanup(); // Call the cleanup function to stop the ongoing process or perform necessary cleanup tasks
			if (cleanup)
				cleanup();
		};
	}, []);

	return (
		<div className="field" id="canvas_container">
			<canvas id="myCanvas"></canvas>
		</div>
	);
}

export default Field;