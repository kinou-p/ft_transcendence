import React from "react"
import {Rank} from '../../DataBase/DataRank.js'
import defaultpic from '../../assets/profile.jpg'

function Ranking(){
	return (
		<div>
			<h1 className='title'>Ranking</h1>
            <div className='scroll'>
                {Rank.map((item, index) => {
                    return (
                        <div className='rank_elements'>
                        <li key={index}>
                                <div>
                                    <h4>{item.rank}: {item.name} <img className="profilePic" src={defaultpic}/></h4>
                                </div>
                                {/* <h4 className='content'>{item.openent}</h4> */}
                            </li>
                        </div>
                        )
                    })}
            </div>
		</div>
	)
}

export default Ranking