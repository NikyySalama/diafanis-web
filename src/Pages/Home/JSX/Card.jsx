import React from 'react';
import '../CSS/Card.css';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, title, imageUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem('electionId', id); 
    navigate(`/election/`);
  };
 

  return (<>
      {imageUrl ? (
        <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src={imageUrl} alt='' className="card-img"/>
        <div className='container-title'>
        <h3 className="card-title">{title}</h3>
        </div>
        </div>
        
      ) : (
        <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <h3 className="card-titleAlone">{title}</h3>
        </div>
      )
      }
      </>
  );
};


export default Card;
