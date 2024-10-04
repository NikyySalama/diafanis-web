import React from "react";
import Footer from "../../../Common/Footer";
import '../CSS/PageTableInfo.css'
import Title from "../../Election/JSX/Title";
import Menu from "../../../Common/Menu";
import MainContent from "./MainContent";
import { useState, useEffect } from 'react';

const PageTableInfo = () => {

  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve tableUuid from sessionStorage
  const tableUuid = sessionStorage.getItem('tableUuid');

  useEffect(() => {
    // Define the fetchData function to get table data
    const fetchData = async () => {
      try {
        if (!tableUuid) {
          console.warn('No table UUID found in sessionStorage.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/tables/${tableUuid}`, {
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
      <Menu />
      <Title content={`Mesa ${tableUuid}`} />
      <MainContent  /> {/* Pass formulas as a prop */}
      <Footer />
    </div>
  );
};
export default PageTableInfo