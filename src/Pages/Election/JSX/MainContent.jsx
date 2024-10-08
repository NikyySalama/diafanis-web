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
  const [display,setDisplay]  = useState(null);
  const [results, setResults] = useState({});
  // Fetch election from sessionStorage once
  const savedElection = sessionStorage.getItem('election');
  const election = savedElection ? JSON.parse(savedElection) : null;

 // Create formulaMap and positions after the election data is available
  useEffect(() => {
    if (election && Array.isArray(election.electionPositions)) {
      
      const newPositionsMap = {};

      election.electionPositions.forEach((position) => {
        newPositionsMap[position.uuid] = position;
      });

      if (JSON.stringify(newPositionsMap) !== JSON.stringify(positions)) {
        setPositions(newPositionsMap);
        console.log(newPositionsMap);
        sessionStorage.setItem('positions', JSON.stringify(newPositionsMap));
      }
    } else {
      console.warn('No election positions available or election data is missing.');
    }    
  }, [election]); 

  
  useEffect(() => {
    if (election && election.endsAt && election.endsAt.length > 0) {
      const electionDate = new Date(election.endsAt);
      // Get the current date and time
      const currentDate = new Date();
      // Compare the dates
      const show  = electionDate < currentDate;
      setDisplay(show);
      sessionStorage.setItem('display',JSON.stringify(display));
    }
  }, [election]);

  useEffect(() =>{
    if(election && election.uuid){
      const fetchData = async () => {
        try {
          console.log("4314");
          console.log(election.uuid);
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${election.uuid}/results`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
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
  },[election,results]);

  useEffect(() =>{
    const newFormulaMap = {};
    if(election && election.uuid){
      const fetchData = async () => {
        try {
          console.log("4314");
          console.log(election.uuid);
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${election.uuid}/electiveFormulas`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          data.forEach((formula) => {
            newFormulaMap[formula.uuid] = formula;
          });
    
      // Check if the new formulaMap is different from the current one
      if (JSON.stringify(newFormulaMap) !== JSON.stringify(formulaMap)) {
        setFormulaMap(newFormulaMap);
        console.log(newFormulaMap);
        sessionStorage.setItem('formulas', JSON.stringify(newFormulaMap));
      }
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  },[election]);


    return (
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <div className='main-container'>
          {election ? (
            <>
              <div className='left-container'>
                <SearchField />
                <List sx={{overflowY:'auto',width: '100%', backgroundColor: '#FFFFFF',padding:'0'}} className='list-tables'>
                  {election.votingTables && election.votingTables.length > 0 && (
                    election.votingTables.map((table) => (
                    <ItemMesa key={table.uuid} uuid={table.uuid} />
                    ))
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
                        <Typography sx={{color:'var(--primary-color)'}}  variant="body1">Lo sentimos, la elección aún no ha terminado</Typography>
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

export default MainContent

