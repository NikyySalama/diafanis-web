import React from 'react';
import '../CSS/Title.css';

const Title = ({content}) => {
  return (
    <div className="title-container">
      <h1 className='title'>{content}</h1>
    </div>
  );
};

export default Title;
