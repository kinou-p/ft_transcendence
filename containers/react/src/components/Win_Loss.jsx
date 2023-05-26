// import PropTypes from "prop-types"
import styled from 'styled-components';
import '../DataBase/DummyDBWinLoss.js'
import { DBWinLoss } from '../DataBase/DummyDBWinLoss.js';
// import color from '../../utils/style/color.js';



const CardWrapper = styled.div`
        display: flex;
        flex-direction: column;
        padding: 15px;
        background-color: black;
        // border-radius: 30px;
        // width: 350px;
        // transition: 200ms;
		margin-top: 50px;
        &:hover {
            cursor: pointer;
            box-shadow: 2px 2px 10px #b6b6b6;
        }
`

const CardLabel1 = styled.span`
    color: #5843e4;
    font-size: 22px;
    font-weight: bold;
	margin-bottom: 25px;
`
const CardLabel2 = styled.span`
	color: #5843e4;
    font-size: 22px;
    font-weight: bold;
	display: flex;
	flex-direction: column;
`

// const CardImage = styled.img`
//     heigh: 80px;
//     width: 80px;
//     border-radius: 50%;
// `

function WinLoss() {
    return (
        <CardWrapper>
            <CardLabel1>Match history Win/Loss</CardLabel1>
            {/* <CardImage src={picture} alt="freelance" height={80} width={80} /> */}
			{DBWinLoss.map((item, index) => {
					return (
						<li key={index}>
							<CardLabel2>{item.title}</CardLabel2>
							<CardLabel2>{item.score}</CardLabel2>
						</li>
					)
				})}
        </CardWrapper>
    )
}

// Card.propTypes = {
//     label: PropTypes.string,
//     title: PropTypes.string.isRequired,
//     picture: PropTypes.string,
// }
 
export default WinLoss