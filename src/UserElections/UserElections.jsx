import React, { useState, useEffect } from 'react';
import electionsData from '../elections';
import './UserElections.css'
import ElectionInList from './ElectionInList';

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
    <div className='my-elections'>
      <h1 className='my-elections-title'>Sus Elecciones</h1>
      <button className='add-election-button' onClick={addElection}>Crear Eleccion</button>
      <div style={{padding: '10px'}}>
        <div className="election-data">
          <span className="election-name">Nombre</span>
          <span className="election-date">Fecha de Inicio</span>
          <span className="election-date">Fecha de Fin</span>
        </div>
        <ul className='election-list'>
          {elections.map((election, index) => (
            <li key={index}>
              <ElectionInList name={election.name} startDate={election.startDate} endDate={election.endDate}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserElections;
