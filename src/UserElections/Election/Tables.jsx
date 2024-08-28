import React, { useState, useEffect } from 'react';
import { getTables, addTable } from '../tables';
import Table from './Table';
import './Tables.css'

const Tables = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    setTables(getTables());
  }, []);

  /*const handleListClicked = (title) => {
    setListClicked(title)
    openListModal();
  }*/

  return (
    <div className='my-tables'>
      <h1 className='my-tables-title'>Sus Mesas</h1>
      <button className='add-table-button' >Crear Mesa</button>
      <div style={{padding: '10px'}}>
        <div className="table-data">
            <span className="table-id">Numero</span>
            <span className="table-location">Locacion</span>
        </div>
        <ul className='tables-container'>
          {tables.map((table, index) => (
            <li key={index}>
              <Table location={table.location} id={table.id}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tables;
