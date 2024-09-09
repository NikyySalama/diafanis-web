import React from 'react';
import '../CSS/MainContent.css';
import { useState, useEffect } from 'react';

import { Carousel } from '@mantine/carousel';

import { MantineProvider } from '@mantine/core';
import ItemFormulaResult from '../../Election/JSX/ItemFormulaResult';
import '@mantine/carousel/styles.css';
const MainContent = () => {
  const positions = localStorage.getItem('positions') ? JSON.parse(localStorage.getItem('positions')) : null;
 
  const table = localStorage.getItem('tableInfo') ? JSON.parse(localStorage.getItem('tableInfo')) : null;
  
     const forms = localStorage.getItem('formulas') ? JSON.parse(localStorage.getItem('formulas')) : null;
   
    return (
       
        <div className='main-container-table'>
            <div className='row-container'>
                <div className='texts-container'>
                    <div className='text-container'>
                        <h1 className='title-field'>Acta</h1>
                        <h3 className='output-field'>7960w997667</h3>
                    </div>
                    <div className='text-container'>
                        <h1 className='title-field'>Hash</h1>
                        <h3 className='output-field'>10298e094819194bbmada9qmc0</h3>
                    </div>
                </div>
            </div>
            <div className="text-full-container">
                <h1 className='title-field'>Public key</h1>
                <h3 className='output-field'>7960w9976677960w9976677960w997667</h3>
            </div>
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <Carousel  className="carousel" slideSize="70%" slideGap="md" withControls withIndicators >
  {table?.results && Object.entries(table.results).map(([positionId, formulas], index) => (
    <Carousel.Slide key={index} className="carouselSlide">
      <>
        <h2 className="slideTitulo">
          {positions[positionId]?.title || 'Unknown Position'}
        </h2>
        {Object.entries(formulas).map(([formulaId, votes]) => (
          <ItemFormulaResult
            key={formulaId}
            votes={votes}
            
            imgUrl={forms[formulaId]?.party?.logoUrl}
          />
        ))}
      </>
    </Carousel.Slide>
  ))}
</Carousel>

            </MantineProvider>
        </div>
       
    );
};

export default MainContent


