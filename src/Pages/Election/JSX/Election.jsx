import React from "react";
import Footer from "../../../Common/Footer";
import '../CSS/Election.css'
import Title from "./Title";
import MainContent from "./MainContent";
import Menu from "../../../Common/Menu";
import { useState, useEffect } from 'react';

const Election = () => {
  const [election, setElection] = useState(null); // Initialize with null to handle loading states
  const [elecctionUuid, setElecctionUuid] = useState(null); // Initialize with null for the UUID
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const savedElectionId = localStorage.getItem('electionId');
    if (savedElectionId) {
      setElecctionUuid(savedElectionId);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (elecctionUuid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/elections/${elecctionUuid}`, {
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
          localStorage.setItem('election', JSON.stringify(data)); // Save election to localStorage
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
        <p>Loading...</p> // Loading message while fetching UUID
      ) : !elecctionUuid ? (
        <p>No election ID found.</p> // Message if no UUID is found
      ) : !election ? (
        <p>Loading election data...</p> // Message while fetching election data
      ) : (
        <>
          <Menu />
          <Title content={election.title} />
          <MainContent />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Election