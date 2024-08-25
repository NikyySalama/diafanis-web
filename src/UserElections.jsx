import React, { useState, useEffect } from 'react';
import electionsData from './elections';
import './UserElections.css'

const UserElections = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    setElections(electionsData);
  }, []);

  const addElection = () => {
    const newElection = {
        id: elections.length + 1,
        name: prompt('Ingrese el nombre de la elección:'),
        description: prompt('Ingrese la descripción de la elección:'),
        startDate: prompt('Ingrese la fecha de inicio (YYYY-MM-DD):'),
        endDate: prompt('Ingrese la fecha de cierre (YYYY-MM-DD):'),
      };

    if (newElection.name && newElection.description && newElection.startDate && newElection.endDate) {
        setElections([...elections, newElection]);
    }
    else{
        //TODO: msj de completar campos faltantes
    }
  };

  return (
    <div>
      <h1 className='my-elections-title'>Sus Elecciones</h1>
      <button className='add-election-button' onClick={addElection}>Crear Eleccion</button>
      <ul className='election-list'>
        {elections.map((election, index) => (
          <li key={index}>
            {election.name}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default UserElections;
