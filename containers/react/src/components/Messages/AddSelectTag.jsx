import React, { useState } from "react";
import { Rank } from "../../DataBase/DataRank";

const AddSelectTag = () => {
    // const [selectCount, setSelectCount] = useState(0);
    // const [selectValues, setSelectValues] = useState([]);

    // const handleAddSelect = () => {
    //     setSelectCount((selectCount)  => selectCount + 1);
    //     setSelectCount((selectValues) =>[...selectValues, `select${selectCount + 1}`]   );
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
            <select>
                    {Rank.map((item, index) => {
                        return (
                            <option value="data">{item.name}
                            {/* <input type="checkbox" /> */}
                            </option>
                        )
                    })}
                </select>
        </div>
    )
}

export default AddSelectTag;