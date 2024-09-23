import React from "react";
import '../CSS/ItemFormulaResult.css'
import Typography from '@mui/material/Typography';
const ItemFormulaResult = ({imgUrl,votes}) => {
    return (
      <div className="ItemFormulaResult-container">
        <img className="ItemFormulaResult-mg" src={imgUrl} alt="Party Logo" />
        <Typography color='var(--primary-color)'  variant="h5" className='ItemFormulaResult-percentage'>{votes}</Typography>
      </div>
    );
  };

export default ItemFormulaResult;