import React from "react";
import Footer from "../../../Common/Footer";
import '../CSS/PageTableInfo.css'
import Title from "../../Election/JSX/Title";
import Menu from "../../../Common/Menu";
import MainContent from "./MainContent";
import { useState, useEffect } from 'react';





const PageTableInfo = () => {


    const  tableUuid = localStorage.getItem('tableUuid')
    const [table, setTable] = useState([]);

  useEffect(() => {
  
    const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/tables/${tableUuid}`, {
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
            setTable(data); // Set the fetched data to the state
            const form = localStorage.getItem('formulas') ? JSON.parse(localStorage.getItem('formulas')) : null;
            localStorage.setItem('forms',JSON.stringify(form));
        } catch (error) {
            console.error('Error fetching data:', error); // Handle any errors
        }
    };

    fetchData(); // Call the asynchronous fetch function
}, [tableUuid]); 
 



    return (
    <div className="PageTableInfo">
        <Menu/>
        <Title content={`Mesa ${tableUuid}`}/>
        <MainContent forms/>
       <Footer/>
    </div>
    );
  };

export default PageTableInfo