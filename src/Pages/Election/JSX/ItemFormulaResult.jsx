import React from "react";
import '../CSS/ItemFormulaResult.css'

const ItemFormulaResult = ({imgUrl,votes}) => {
    return (
      <div className="ItemFormulaResult-container">
        <img className="ItemFormulaResult-mg" src={imgUrl} alt="Party Logo" />
        <h4 className='ItemFormulaResult-percentage'>{votes}</h4>
      </div>
    );
  };

export default ItemFormulaResult;