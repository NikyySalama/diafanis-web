import React from "react";
import Footer from "../../../Common/Footer";
import '../CSS/Election.css'
import Title from "./Title";
import MainContent from "./MainContent";
import Menu from "../../../Common/Menu";
import { useState, useEffect } from 'react';

const Election = () => {
  const  elecctionUuid = localStorage.getItem('electionId')
  const [election, setElection] = useState([]);

  useEffect(() => {
  
    const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/elections/${elecctionUuid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
            // Ensure the response is ok before converting to JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Convert the response to JSON
            setElection(data); // Set the fetched data to the state
        } catch (error) {
            console.error('Error fetching data:', error); // Handle any errors
        }
    };

    fetchData(); // Call the asynchronous fetch function
},  [elecctionUuid]); 

useEffect(() => {
  if (election) {
    localStorage.setItem('election', JSON.stringify(election));
   
  }
}, [election]); // This effect will run every time `election` changes

    return (
      
    <div className="election">
        <Menu/>
        <Title content={election.title}/>
        <MainContent/>
        <Footer/>
    </div>
    );
  };

export default Election