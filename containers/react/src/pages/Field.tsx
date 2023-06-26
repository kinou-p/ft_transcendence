import { useEffect } from 'react';
import DrawCanvas from './canvas.tsx';
import queryString from 'query-string';
import '../styles/field.css';
import React from 'react';


interface GameProps {
	privateParty: boolean,
	username?: string
	gameId?: number
}

function Field()
{
	useEffect(() => {
		const queryParams = queryString.parse(window.location.search);
		
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
			info = {
				privateParty: true,
				username: queryParams.username as string,
				gameId: queryParams.gameId as unknown as number
			}
		}

		const cleanup = DrawCanvas(Modifiers, info);
	
		return () => {
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