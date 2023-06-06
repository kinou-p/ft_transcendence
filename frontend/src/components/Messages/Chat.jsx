import React from "react"
import styled from "styled-components"
import '../../styles/Messages.css'
import DefaultPic from '../../assets/profile.jpg';
import { ImBlocked } from 'react-icons/im';
import { MdOutlineGroupAdd } from 'react-icons/md';
import Conversation from "./Conversation";
import Input from "./Input";


const TouchDiv = styled.div`
	margin-left: 10px;
	margin-right: 4px;
	margin-bottom: 21px;
	margin-top: 21px;
	cursor: pointer;
	justify-content: space-around;
	
	&:hover {
		color: #F4F3EF;
	}
`

function Chat(){
	return (
		<div className="chat">
			<div className='navbar'>
				<img src={DefaultPic} alt="profile" className="pic"/>
				<TouchDiv>Dummy</TouchDiv>
				<div className="end">
					<TouchDiv>
						<MdOutlineGroupAdd/>
					</TouchDiv>
					<TouchDiv>
						<ImBlocked/>
					</TouchDiv>
				</div>
			</div>
			<Conversation/>
			<Input/>
		</div>
	)
}

export default Chat


// const SideSpan = styled.span`
// 	font-size: 18px;
// 	font-weight: 500;
// 	cursor: pointer;
// 	margin-bottom: 40px;
	
// 	&:hover {
// 		color: #F4F3EF;
// 	}
// `

// const SideP = styled.p`
// 	font-size: 14px;
// 	color: lightgray
// `