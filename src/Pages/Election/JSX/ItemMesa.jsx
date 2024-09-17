import React from 'react';
import '../CSS/ItemMesa.css';



import { useNavigate } from 'react-router-dom';

const ItemMesa = ({uuid}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem('tableUuid', uuid); 
    navigate(`/election/table`);
  };
  
  return (
    <div className="table-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <h4 className='table-mesa'>Mesa</h4>
        <h6 className='uuid'>{uuid}</h6>
    </div>
  )};

export default ItemMesa;