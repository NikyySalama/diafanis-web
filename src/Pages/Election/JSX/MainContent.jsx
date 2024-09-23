import React from 'react';
import '../CSS/MainContent.css';
import { useState, useEffect } from 'react';
import SearchField from './SearchField';
import ItemMesa from './ItemMesa';

import { Carousel } from '@mantine/carousel';
import ItemFormulaResult from './ItemFormulaResult';
import { MantineProvider } from '@mantine/core';

import '@mantine/carousel/styles.css';
const MainContent = () => {
  const [formulaMap, setFormulaMap] = useState({});
  const [positions, setPositions] = useState({});
  const [display,setDisplay]  = useState(null);
  const [results, setResults] = useState({});
  // Fetch election from localStorage once
  const savedElection = localStorage.getItem('election');
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
        localStorage.setItem('positions', JSON.stringify(newPositionsMap));
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
      localStorage.setItem('display',JSON.stringify(display));
    }
  }, [election]);

  useEffect(() =>{
    if(election && election.uuid && display){
      const fetchData = async () => {
        try {
          console.log("4314");
          console.log(election.uuid);
          const response = await fetch(`http://localhost:8080/api/elections/${election.uuid}/results`, {
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
  },[election,display,results]);

  useEffect(() =>{
    const newFormulaMap = {};
    if(election && election.uuid){
      const fetchData = async () => {
        try {
          console.log("4314");
          console.log(election.uuid);
          const response = await fetch(`http://localhost:8080/api/elections/${election.uuid}/electiveFormulas`, {
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
        localStorage.setItem('formulas', JSON.stringify(newFormulaMap));
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
        {election ?
          (

            <>
              <div className='left-container'>
                <SearchField />
                <div className='list-tables'>
                  {election.votingTables && election.votingTables.length > 0 && (
                    election.votingTables.map((table) => (
                      <ItemMesa key={table.uuid} uuid={table.uuid} />
                    ))
                  )}
                </div>
              </div>
              <div className='right-container'>
                <h1 className='result'>Resultados</h1>
                <Carousel className="carousel" slideSize="70%" slideGap="md" withControls withIndicators >
                  {display && results && Object.entries(results).map(([positionId, formulas], index) => (
                    <Carousel.Slide key={index} className="carouselSlide">
                      <>
                        <h2 className="slideTitulo">
                          {positions[positionId]?.title || 'Unknown Position'}
                        </h2>
                        {Object.entries(formulas).map(([formulaId, votes]) => (
                          <ItemFormulaResult
                            key={formulaId}
                            votes={votes}

                            imgUrl={formulaMap[formulaId]?.party?.logoUrl}
                          />
                        ))}
                      </>
                    </Carousel.Slide>
                  ))}
                </Carousel>


              </div>
            </>
          ) :
          (
            <h1 className='error'>Lo sentimos, la eleccion aun no ha terminado</h1>
          )
        }

      </div>
    </MantineProvider>
  );
};

export default MainContent

/*

{election.votingTables && election.votingTables.map((table) => ( 
                    
                        <ItemMesa key={table.uuid} uuid={table.uuid}/>
                    
                    ))}
*/