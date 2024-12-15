import React from "react";
import Footer from "../../../Common/Footer";
import '../CSS/PageTableInfo.css'
import Title from "../../Election/JSX/Title";
import Menu from "../../../Common/Menu";
import MainContent from "./MainContent";
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
const PageTableInfo = () => {

  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
 const navigate = useNavigate();
  // Retrieve tableUuid from sessionStorage
  const tableUuid = sessionStorage.getItem('tableUuid');
  const goBack = () => {
    navigate(`/election`);
  }
  useEffect(() => {
    // Define the fetchData function to get table data
    const fetchData = async () => {
      try {
        if (!tableUuid) {
          console.warn('No table UUID found in sessionStorage.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables/${tableUuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Ensure the response is okay
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convert the response to JSON
        const data = await response.json();
        setTable(data); // Set the fetched data to the state

        // Store the table data in sessionStorage
        sessionStorage.setItem('tableInfo', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching data:', error); // Handle any errors
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the asynchronous fetch function
  }, [tableUuid]); // Run when tableUuid changes

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while data is being fetched
  }

  return (
    <div className="PageTableInfo">
    <Box sx={{display:'flex',flexDirection:'column' ,flex: '1 0 auto',paddingBottom:'1em' }}>
      <Menu/>
      
      <Box sx={{paddingTop:'4em',paddingLeft:'0.5em',display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
        <Button 
         onClick={goBack}
        sx={{  color: 'var(--primary-color)'}}>
         Volver
            </Button>
         </Box>
      <Title content={`Mesa ${tableUuid}`} />
      <MainContent  /> {/* Pass formulas as a prop */}
      </Box>

      <Box sx={{ flexShrink: 0 }}>
      <Footer />
    </Box>
    </div>
  );
};
export default PageTableInfo