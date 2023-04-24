import React from "react"
import styled from "styled-components"
import DefaultPic from '../../assets/profile.jpg'
import '../../Style/Messages.css'

const StyleP = styled.p`
	background-color: white;
	padding 10px 20px;
	border-radius 0px 10px 10px 10px;
	color: black;
	margin-left: 20px;
`

function MessageYou(){
	return (
		<div className="youMessage">
			<div>
				<img className="messageInfo" src={DefaultPic} alt="profile" />
			</div>
			<div className="messageContent">
				<StyleP>bonjours ca va</StyleP>
			</div>
		</div>
	)
}

export default MessageYou