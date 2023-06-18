import React from "react";
import PlayButton from "../components/Game/PlayButton.tsx";
import Ranking from "../components/Game/Ranking.tsx";
import '../styles/Game.css'

function Game(){
	return (
		<div className="game">
			<div className="game">
				<Ranking/>
			</div>
			<div className="game">
				<PlayButton/>
			</div>
		</div>
	)
}
export default Game