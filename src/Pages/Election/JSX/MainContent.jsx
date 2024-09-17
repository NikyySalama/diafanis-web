import React from 'react';
import '../CSS/MainContent.css';
import { useState, useEffect } from 'react';
import SearchField from './SearchField';
import ItemMesa from './ItemMesa';

import { Carousel } from '@mantine/carousel';
import ItemFormulaResult from './ItemFormulaResult';
import { MantineProvider } from '@mantine/core';

import '@mantine/carousel/styles.css';
const MainContent = ( ) => {
  const [tableUuid, setTableUuid] = useState(null);
  const [table, setTable] = useState({});
  const [formulaMap, setFormulaMap] = useState({});

  // Fetch election from localStorage once
  const savedElection = localStorage.getItem('election');
  const election = savedElection ? JSON.parse(savedElection) : null;

  // Create positions and parties maps
  const positions = election?.electionPositions?.reduce((acc, position) => {
    acc[position.uuid] = position;
    return acc;
  }, {}) || {};

  const parties = election?.parties?.reduce((acc, party) => {
    acc[party.uuid] = party;
    return acc;
  }, {}) || {};

  // Set the table UUID after the election data is available
  useEffect(() => {
    if (election && election.votingTables && election.votingTables.length > 0) {
      const uuid = election.votingTables[0].uuid;
      if (tableUuid !== uuid) { // Check if the UUID is different
        setTableUuid(uuid);
        console.log('Table UUID:', uuid);
      }
    }
  }, [election, tableUuid]); // Add tableUuid to dependencies to handle changes
  // Create formulaMap after the election data is available
  useEffect(() => {
    if (election && Array.isArray(election.electionPositions)) {
      const newFormulaMap = {};
  
      election.electionPositions.forEach((position) => {
        if (Array.isArray(position.formulas)) {
          position.formulas.forEach((formula) => {
            if (formula && formula.uuid) {
              newFormulaMap[formula.uuid] = formula;
            }
          });
        }
      });
  
      // Check if the new formulaMap is different from the current one
      if (JSON.stringify(newFormulaMap) !== JSON.stringify(formulaMap)) {
        setFormulaMap(newFormulaMap);
        console.log(newFormulaMap);
        localStorage.setItem('formulas', JSON.stringify(newFormulaMap));
      }
    } else {
      console.warn('No election positions available or election data is missing.');
    }
  }, [election, formulaMap]); // Include formulaMap in dependencies

  // Fetch table data after the tableUuid is set
  useEffect(() => {
    if (tableUuid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/tables/${tableUuid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setTable(data);
          localStorage.setItem('positions', JSON.stringify(positions));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [tableUuid]); // Correctly depends on `tableUuid`




    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
        <div className='main-container'>
            {election ? 
            (
             
                <>
                <div className='left-container'>
                <SearchField/>
                <div className='list-tables'>
                {election.votingTables && election.votingTables[0] && ( 
                  <ItemMesa key={election.votingTables[0].uuid} uuid={election.votingTables[0].uuid}/>
                )}
                </div>
                </div>
                <div className='right-container'>
                    <h1 className='result'>Resultados</h1>
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