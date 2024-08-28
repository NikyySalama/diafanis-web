import React, { useState, useEffect } from 'react';
import { getLists, addList } from '../lists';
import List from '../List';
import './UserLists.css'

const UserLists = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    setLists(getLists());
  }, []);

  /*const handleListClicked = (title) => {
    setListClicked(title)
    openListModal();
  }*/

  return (
    <div className='my-lists'>
      <h1 className='my-lists-title'>Sus Listas</h1>
      <button className='add-list-button' >Crear Lista</button>
      <div style={{padding: '10px'}}>
        <div className="list-data">
          <span className="list-name">Nombre</span>
        </div>
        <ul className='lists-container'>
          {lists.map((list, index) => (
            <li key={index}>
              <List name={list.name} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserLists;
