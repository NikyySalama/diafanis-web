import React from 'react';
import '../CSS/MainContent.css';
import { useState, useEffect } from 'react';
import SearchField from './SearchField';
import ItemMesa from './ItemMesa';

import { Carousel } from '@mantine/carousel';
import ItemFormulaResult from './ItemFormulaResult';
import { MantineProvider } from '@mantine/core';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import '@mantine/carousel/styles.css';

const MainContent = () => {
  const [formulaMap, setFormulaMap] = useState({});
  const [positions, setPositions] = useState({});
  const [display, setDisplay] = useState(null);
  const [results, setResults] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  const savedElection = sessionStorage.getItem('election');
  const election = savedElection ? JSON.parse(savedElection) : null;

  useEffect(() => {
    if (election && Array.isArray(election.electionPositions)) {
      const newPositionsMap = {};
      election.electionPositions.forEach((position) => {
        newPositionsMap[position.uuid] = position;
      });
      if (JSON.stringify(newPositionsMap) !== JSON.stringify(positions)) {
        setPositions(newPositionsMap);
        sessionStorage.setItem('positions', JSON.stringify(newPositionsMap));
      }
    } else {
      console.warn('No election positions available or election data is missing.');
    }
  }, [election]);

  useEffect(() => {
    if (election && election.endsAt && election.endsAt.length > 0) {
      const electionDate = new Date(election.endsAt);
      const currentDate = new Date();
      const show = electionDate < currentDate;
      setDisplay(show);
      sessionStorage.setItem('display', JSON.stringify(display));
    }
  }, [election]);

  useEffect(() => {
    if (election && election.uuid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${election.uuid}/results`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (JSON.stringify(data) !== JSON.stringify(results)) {
            setResults(data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [election, results]);

  useEffect(() => {
    const newFormulaMap = {};
    if (election && election.uuid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${election.uuid}/electiveFormulas`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          data.forEach((formula) => {
            newFormulaMap[formula.uuid] = formula;
          });

          if (JSON.stringify(newFormulaMap) !== JSON.stringify(formulaMap)) {
            setFormulaMap(newFormulaMap);
            sessionStorage.setItem('formulas', JSON.stringify(newFormulaMap));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [election]);

  const filteredTables = election.votingTables?.filter((table) => {
    return table.uuid?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div className='main-container'>
        {election ? (
          <>
            <div className='left-container'>
              <input
                type="text"
                placeholder="Buscar mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-input"
                style={{ 
                  width: '70%',
                  marginBottom: '10px',
                  padding: '10px',
                  boxSizing: 'border-box'
                }}
              />
              <List sx={{ overflowY: 'auto', width: '100%', backgroundColor: '#FFFFFF', padding: '0' }} className='list-tables'>
                {filteredTables && filteredTables.length > 0 ? (
                  filteredTables.map((table) => (
                    <ItemMesa key={table.uuid} uuid={table.uuid} />
                  ))
                ) : (
                  <Typography variant="body1">No se encontraron mesas</Typography>
                )}
              </List>
            </div>
            <div className='right-container'>
              <Typography color='var(--primary-color)' variant='h4' className='carousel-title'>Resultados</Typography>
              {results && Object.keys(results).length > 0 ? (
                <Carousel slideSize="100%" slideGap="md" align="start" withControls withIndicators>
                  {Object.entries(results).map(([positionId, formulas]) => (
                    <Carousel.Slide key={positionId} className="carouselSlide">
                      <Typography variant="h5" className="slideTitulo">
                        {positions[positionId]?.title || 'Unknown Position'}
                      </Typography>
                      {display ? (
                        Object.entries(formulas).map(([formulaId, votes]) => (
                          <ItemFormulaResult
                            key={formulaId}
                            votes={votes}
                            imgUrl={formulaMap[formulaId]?.party?.logoUrl}
                          />
                        ))
                      ) : (
                        <Typography sx={{ color: 'var(--primary-color)' }} variant="body1">Lo sentimos, la elección aún no ha terminado</Typography>
                      )}
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </MantineProvider>
  );
};

export default MainContent;