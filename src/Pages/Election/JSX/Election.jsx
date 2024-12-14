import React from "react";
import Footer from "../../../Common/Footer";
import '../CSS/Election.css'
import Title from "./Title";
import MainContent from "./MainContent";
import Menu from "../../../Common/Menu";
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

const Election = () => {
  const [election, setElection] = useState(null); // Initialize with null to handle loading states
  const [elecctionUuid, setElecctionUuid] = useState(null); // Initialize with null for the UUID
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const savedElectionId = sessionStorage.getItem('electionId');
    if (savedElectionId) {
      setElecctionUuid(savedElectionId);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (elecctionUuid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${elecctionUuid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setElection(data);
          sessionStorage.setItem('election', JSON.stringify(data)); // Save election to sessionStorage
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [elecctionUuid]); // Fetch data only when elecctionUuid changes

  // Render based on the availability of `elecctionUuid` and `election`
  return (
    <div className="election">
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center"  height="100%" width="100%">
          <p>Cargando...</p>
        </Box>
      ) : !elecctionUuid ? (
        <Box   display="flex" alignItems="center" justifyContent="center"  height="100%" width="100%">
          <p>No se encontro la eleccion.</p>
        </Box>
      ) : !election ? (
        <Box display="flex" alignItems="center" justifyContent="center"  height="100%" width="100%">
          <p>Cargando data de la eleccion...</p>
        </Box>
      ) : (
        <>
         <Box sx={{ flex: '1 0 auto' }}>
          <Menu />
          <Title content={election.title} />
          <MainContent />
          </Box>
          <Box sx={{ flexShrink: 0 }}>
          <Footer />
          </Box>
        </>
      )}
    </div>
  );
};

export default Election