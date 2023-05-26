// import PropTypes from "prop-types"
// import styled from 'styled-components';
// import '../DataBase/DummyDBWinLoss.js'
// import '../DataBase/DataProfileUser.js'
import { DBWinLoss } from '../../DataBase/DummyDBWinLoss.js';
import '../../styles/Win_Loss.css'
import { UserProfile } from '../../DataBase/DataUserProfile';
// import color from '../../utils/style/color.js';



// const CardWrapper = styled.div`
//         display: flex;
//         flex-direction: column;
//         padding: 15px;
//         background-color: black;
//         border-radius: 30px;
//         width: 350px;
//         transition: 200ms;
// 		margin-top: 50px;
//         &:hover {
//             cursor: pointer;
//             box-shadow: 2px 2px 10px #b6b6b6;
//         }
// `

// const CardLabel1 = styled.h1`
//     color: #5843e4;
//     // font-size: 22px;
//     font-weight: bold;
// 	margin-bottom: 25px;
// `
// const CardLabel2 = styled.span`
// 	color: #5843e4;
//     font-size: 22px;
//     font-weight: bold;
// 	display: flex;
// 	flex-direction: column;
// `

// const CardImage = styled.img`
//     heigh: 80px;
//     width: 80px;
//     border-radius: 50%;
// `
  
function WinLoss() {
    return (

        <div className='tab'>
            <h1 className='title'>Match history Win/Loss</h1>
            <div className='scroll'>
                {DBWinLoss.map((item, index) => {
                    return (
                        <div className='elements'>
                        <li key={index}>
                                <h4 className='content'>{item.title}</h4>
                                <div className='content2nd'>
                                    <h4 className='me'>{UserProfile.UserName}</h4>  <h4 className='score'>{item.score}  {item.openent}</h4>
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

// Card.propTypes = {
//     label: PropTypes.string,
//     title: PropTypes.string.isRequired,
//     picture: PropTypes.string,
// }
 
export default WinLoss