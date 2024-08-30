import React, { useState, useEffect } from 'react';
import { getLists, addList } from '../lists';
import List from './List';
import { Button, Modal, Form } from 'react-bootstrap';
import './UserLists.css'

const UserLists = () => {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [formData, setFormData] = useState({
    color: '',
    name: '',
    id: ''
  });

  useEffect(() => {
    setLists(getLists());
  }, []);

  const handleListClick = (list) => {
    setSelectedList(list);
  }

  const handleAddListClick = () => {
    setFormData({
      color: '',
      name: '',
      id: ''
    });
    setShowModal(true);
  }

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    handleClose();
  };

  return (
    <div className='my-lists'>
      <h1 className='my-lists-title'>Sus Listas</h1>
      <button className='add-list-button' onClick={handleAddListClick}>Crear Lista</button>
      <div style={{padding: '10px'}}>
        <div className="list-data">
          <span className="list-name">Nombre</span>
        </div>
        <ul className='lists-container'>
          {lists.map((list, index) => (
            <li key={index} onClick={() => handleListClick(list)}>
              <List name={list.name} />
            </li>
          ))}
        </ul>
      </div>
      
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lista Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formColor">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese ID"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserLists;
