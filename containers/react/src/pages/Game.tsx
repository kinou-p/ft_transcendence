import React from "react";
import PlayButton from "../components/Game/PlayButton";
import Ranking from "../components/Game/Ranking";
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