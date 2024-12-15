import React from 'react';
import '../CSS/MainContent.css';
import { useState, useEffect } from 'react';
import SearchField from './SearchField';
import ItemMesa from './ItemMesa';

import Box from '@mui/material/Box';
import ItemFormulaResult from './ItemFormulaResult';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';

const CarouselComponent = ({ results, positions, formulaMap, display }) => {
  return (
    <Box sx={{ padding: '0.75em', margin: '1em',marginRight:'4em', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', borderRadius: '16px', background: 'var(--background-color)', flexGrow: 1, width: '100%',maxHeight:'30em' }}>
      <Carousel
        navButtonsAlwaysVisible
        indicators={true}
        animation="slide"
        autoPlay={false}
        cycleNavigation={false}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}
      >
        {positions && Object.entries(positions).map(([positionId, position], index) => (
          <Box key={index} className="carouselSlide" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Typography variant="h5" className="slideTitulo" sx={{ textAlign: 'center' }}>
              {position.title || 'Unknown Position'}
            </Typography>
            <Box sx={{ overflowY: 'auto', padding: '1em', display: 'flex', flexGrow: 1, width: '100%' }}>
              {display && results && results[positionId] ? (
                Object.entries(results[positionId]).map(([formulaId, votes]) => (
                  <ItemFormulaResult
                    key={formulaId}
                    votes={votes}
                    imgUrl={formulaMap[formulaId]?.party?.logoUrl}
                  />
                ))
              ) : (
                <Typography variant="body1">La elección aun no ha terminado</Typography>
              )}
            </Box>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

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
    const locationString = `${table.location.country}, ${table.location.state}, ${table.location.city}, ${table.location.address}`;
    return locationString.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box sx={{maxWidth: '50%', minWidth: '50%', width: '100%', height: '80%', minHeight: '80%', minWidth: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', overflowY: 'auto' }}>
      {election ? (
        <>
          <Box sx={{ width: '50%', padding: '1em', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifySelf: 'start', alignItems: 'center' }}>
            <Box sx={{ width: '70%', marginBottom: '10px',borderRadius:'16px' }}>
              <input
                type="text"
                placeholder="Buscar mesa..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Box>
              <List sx={{ overflowY: 'auto', width: '100%', backgroundColor: '#FFFFFF', padding: '0', marginTop: '3%', boxShadow: '0 0.25em 0.5em rgba(0, 0, 0, 0.1)', paddingTop: '0.25%', height: '70%', minHeight: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minWidth: '70%', maxWidth: '70%',borderRadius:'16px' }}>
                {filteredTables && filteredTables.length > 0 ? (
                  filteredTables.map((table) => (
                      <ItemMesa uuid={table.uuid} location={`${table.location.country}, ${table.location.state}, ${table.location.city}, ${table.location.address}`} />
                  ))
                ) : (
                  <Typography variant="body1">No se encontraron mesas</Typography>
                )}
              </List>
          </Box>


          <Box sx={{padding:'1em', width: '40%', boxSizing: 'border-box', maxWidth: '40%', minWidth: '40%', height: '50%', minHeight: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
            <Typography color='var(--primary-color)' variant='h4' sx={{paddingBottom:'0.75em', width: 'fit-content', color: '#020246', fontSize: 'calc(0.078125em + 2.5vw)', height: 'fit-content', marginTop: '0%' }}>Resultados</Typography>
              <CarouselComponent results={results} positions={positions} formulaMap={formulaMap} display={true} />
          </Box>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default MainContent;