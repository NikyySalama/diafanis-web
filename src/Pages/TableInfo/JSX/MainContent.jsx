import React from 'react';
import '../CSS/MainContentTable.css';
import { useState, useEffect } from 'react';
import { Carousel } from '@mantine/carousel';
import { MantineProvider } from '@mantine/core';
import { Typography } from '@mui/material';
import ItemFormulaResult from '../../Election/JSX/ItemFormulaResult';
import '@mantine/carousel/styles.css';

const TextContainer = ({ title, content }) => (
  <div className='text-container'>
    <Typography variant="h6" sx={{ color: 'var(--primary-color)' }} className='title-field'>{title}</Typography>
    <Typography variant="body1" sx={{ color: 'var(--primary-color)' }} className='output-field'>{content}</Typography>
  </div>
);

const CarouselComponent = ({ table, positions, forms }) => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Carousel slideSize="100%" slideGap="md" align="start" withControls withIndicators>
      {table.results && Object.entries(table.results).map(([positionId, formulas], index) => (
        <Carousel.Slide key={index} className="carouselSlide">
          <>
            <Typography variant="h5" className="slideTitulo">
              {positions[positionId]?.title || 'Unknown Position'}
            </Typography>
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
);

const MainContent = () => {
  const [positions, setPositions] = useState(null);
  const [table, setTable] = useState(null);
  const [forms, setForms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

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

  useEffect(() => {
    if (table && table?.publicKey && table?.hashedResults) {
      const key = table.publicKey
        .replace(/-----BEGIN RSA PUBLIC KEY-----\n?/, '') // Remove the "BEGIN" line
        .replace(/-----END RSA PUBLIC KEY-----\n?/, '')   // Remove the "END" line
        .replace(/\n/g, '');  // Remove any newline characters inside the key
      const hash = table.hashedResults;
      setHash(hash);
      setPublicKey(key);
    }
  }, [table]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!positions || !table || !forms) {
    return <Typography>Some required data is missing. Please check your localStorage.</Typography>;
  }

  return (
    <div className='main-container-table'>
      <div className='info-container'>
        <TextContainer title="Hash" content={hash} />
        <TextContainer title="Public key" content={publicKey} />
      </div>
      <CarouselComponent table={table} positions={positions} forms={forms} />
    </div>
  );
};

export default MainContent;