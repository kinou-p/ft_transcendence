import React, { useState } from "react";
import { Rank } from "../../DataBase/DataRank";
import { GrAdd } from "react-icons/gr";

function AddSelectTag ({number, array, new_name}) {
    // const [selectCount, setSelectCount] = useState(0);
    // const [selectValues, setSelectValues] = useState([]);

    // const handleAddSelect = () => {
    //     setSelectCount((selectCount)  => selectCount + 1);
    //     setSelectCount((selectValues) =>[...selectValues, `select${selectCount + 1}`]   );
    // };
    // function insertInArray  (number, array, new_name)  {
    //     return (
    //       array[number] = new_name
    //     );
    // };
    return (
        <div>
            {/* <button onClick={handleAddSelect}>Add</button>
            <div>
                {selectValues.map((selectName, index) => (
                    <select key={index} name={selectName}>
                        <option value="option1"> option 1</option>
                        <option value="option2"> option 2</option>
                    </select>
                ))}
            </div> */}
            {/* <select>
                    {Rank.map((item, index) => {
                        return (
                            <option value="data">{item.name}
                            {/* <input type="checkbox" /> */}
                            {/* </option> */}
                        {/* ) */}
                    {/* // })} */}
                {/* // </select> */}
            {/* <div onClick={ () => <insertInArray number={number} array={array} new_name={new_name}/>}> */}
            <div>
                <GrAdd/>
                {/* <h4>{new_name}</h4> */}
            </div>
            {/* {number != 0 ? (
                <div>
                    <p>{array[number]}</p>
                </div>
            ) : ("")} */}
        </div>
    )
}

export default AddSelectTag;