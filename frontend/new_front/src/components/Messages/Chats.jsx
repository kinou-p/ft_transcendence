import React from "react";
import '../../Style/Messages.css'
import styled from "styled-components";
import DefaultPic from '../../assets/profile.jpg'

const UserChat = styled.div `
	padding: 5px;
	display: flex;
	align-items: center;
	gap: 5px;
	color: white;
	cursor: pointer;

	&:hover{
		background-color: #3e3c61;
	}
`

const SideSpan = styled.span`
	font-size: 18px;
	font-weight: 500;
`

const SideP = styled.p`
	font-size: 14px;
	color: lightgray;
	margin-left: 15px;
`

function Chats(){
	return (
		<div className="chat">
			<UserChat>
				<img className="pic-user" src={DefaultPic} alt="User" />
				<div className="infoSideBar">
					<SideSpan>Dummy</SideSpan>
					<SideP>yo</SideP>
				</div>
			</UserChat>
			<UserChat>
				<img className="pic-user" src={DefaultPic} alt="User" />
				<div className="infoSideBar">
					<SideSpan>Dummy</SideSpan>
					<SideP>yo</SideP>
				</div>
			</UserChat><UserChat>
				<img className="pic-user" src={DefaultPic} alt="User" />
				<div className="infoSideBar">
					<SideSpan>Dummy</SideSpan>
					<SideP>yo</SideP>
				</div>
			</UserChat><UserChat>
				<img className="pic-user" src={DefaultPic} alt="User" />
				<div className="infoSideBar">
					<SideSpan>Dummy</SideSpan>
					<SideP>yo</SideP>
				</div>
			</UserChat>
		</div>
	);
}

export default Chats