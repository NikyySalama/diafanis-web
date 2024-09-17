import React from 'react';
import '../CSS/MainContent.css';
import { useState, useEffect } from 'react';

import { Carousel } from '@mantine/carousel';

import { MantineProvider } from '@mantine/core';
import ItemFormulaResult from '../../Election/JSX/ItemFormulaResult';
import '@mantine/carousel/styles.css';
const MainContent = () => {
  const [positions, setPositions] = useState(null);
  const [table, setTable] = useState(null);
  const [forms, setForms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve data from localStorage and set state
    const storedPositions = localStorage.getItem('positions');
    const storedTable = localStorage.getItem('tableInfo');
    const storedForms = localStorage.getItem('formulas');

    // Parse and set state
    setPositions(storedPositions ? JSON.parse(storedPositions) : null);
    setTable(storedTable ? JSON.parse(storedTable) : null);
    setForms(storedForms ? JSON.parse(storedForms) : null);

    // Set loading to false after data retrieval
    setLoading(false);

    // Log warnings if data is missing
    if (!storedPositions) {
      console.warn('Positions data is missing.');
    }
    if (!storedTable) {
      console.warn('Table data is missing.');
    }
    if (!storedForms) {
      console.warn('Forms data is missing.');
    }
  }, []);

  // Handle missing data scenarios
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!positions || !table || !forms) {
    return <p>Some required data is missing. Please check your localStorage.</p>;
  }

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
        <Carousel className="carousel" slideSize="70%" slideGap="md" withControls withIndicators>
          {table.results && Object.entries(table.results).map(([positionId, formulas], index) => (
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


