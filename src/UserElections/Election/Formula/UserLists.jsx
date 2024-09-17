import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import List from './List';
import { Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './UserLists.css';

const UserLists = () => {
  const electionId = useElection();
  const [parties, setParties] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    partyId: '',
    partyName: '',
    id: ''
  });

  const [positionsData, setPositionsData] = useState([]);
  const [formulas, setFormulas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFormulas = await fetchFormulas();
      const fetchedPositions = await fetchPositions();
  
      setFormulas(fetchedFormulas);
      setPositions(fetchedPositions);

      console.log('Formulas fetched:', fetchedFormulas);
    };
  
    fetchData();
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try{
    const response = await fetch(`http://localhost:8080/api/elections/${electionId}/parties`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    });

    if(response.ok) {
        const data = await response.json();
        console.log('Fetched parties:', data);
        setParties(data);
    } else{
        console.error('error al obtener los partidos', response.statusText);
    }
    } catch(error){
        console.error('error en la solicitud de partidos', error);
    }
  }

  const fetchFormulas = async () => {
    try {
      const responsePositions = await fetch(`http://localhost:8080/api/elections/${electionId}/electionPositions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!responsePositions.ok) {
        throw new Error('Error al obtener las posiciones');
      }
  
      const positions = await responsePositions.json();

      positions.forEach(position => {
        console.log('Position:', position);
      });
  
      const formulas = positions.flatMap((position) => 
        position.formulas.map((formula) => ({
          title: position.title,
          formulaNumber: formula.idNumber,
          partyName: formula.party.name 
        }))
      );
      
      console.log(formulas);
      return formulas;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/elections/${electionId}/electionPositions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error al obtener los posiciones');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const handleCreateListClick = () => {
    setFormData({ partyId: '', partyName: '', id: '' });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'partyId') {
      console.log('Party ID selected:', value); // Verifica el ID seleccionado
      const selectedParty = parties.find(party => party.uuid === value); // Cambiar a buscar por 'uuid'
      console.log('Selected Party Object:', selectedParty); // Verifica el objeto del partido seleccionado
  
      const newPartyName = selectedParty ? selectedParty.name : '';
      console.log('Selected Party Name:', newPartyName); // Verifica el nombre del partido seleccionado
      
      setFormData({
        ...formData,
        [name]: value,
        partyName: newPartyName
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data saved:', formData);
    handleClose();
    setShowPositionsModal(true);
  };

  const handleClosePositionsModal = () => setShowPositionsModal(false);
  
  const handleFileUpload = (e, positionId) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
  
      const candidates = data.map(row => ({
        role: row.role || 'Desconocido',
        docNumber: parseInt(row.DNI, 10) || 0,
        docType: 'DNI',
        name: row.name || 'Nombre Desconocido',
        surname: row.lastName || 'Apellido Desconocido',
        image: row.imageUrl || ''
      }));
  
      setPositionsData(prevData => {
        const updatedPositionsData = [...prevData];
        updatedPositionsData[positionId] = candidates;
        return updatedPositionsData;
      });
    };
  
    reader.readAsArrayBuffer(file);
  };  
  
  const handlePositionsSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const postPromises = positions.map(async (position, index) => {
        if (!Array.isArray(positionsData[index])) {
          console.error(`Error: La entrada para la posición ${index} no es un array.`);
          return;
        }
  
        const candidates = positionsData[index].map((candidate, candidateIndex) => ({
          role: candidate.role,
          imageUrl: candidate.image,
          zindex: candidateIndex,
          data: {
            docNumber: candidate.docNumber,
            docType: candidate.docType,
            name: candidate.name,
            lastName: candidate.surname,
            imageUrl: candidate.image,
          },
        }));
  
        const formulaDataContent = {
          title : "title", 
          partyUuid: formData.partyId,
          idNumber: formData.id,
          candidates
        };

        console.log(`Datos que se enviarán para la posición ${position.uuid}:`, JSON.stringify(formulaDataContent, null, 2));
  
        const response = await fetch(`http://localhost:8080/api/electiveFormulas/${position.uuid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formulaDataContent), 
        });
  
        if (!response.ok) {
          throw new Error(`Error al enviar la fórmula para la posición ${position.title}`);
        }
  
        return response.json();
      });
  
      const results = await Promise.all(postPromises);
  
      results.forEach((result, index) => {
        console.log(`Fórmula subida para la posición ${positions[index].title}:`, result);
      });
  
      console.log('Todas las fórmulas han sido enviadas con éxito.');
    } catch (error) {
      console.error('Error en el envío de fórmulas:', error);
    }
  
    handleClosePositionsModal();
  };  
  

  return (
    <div className="user-lists">
      <h1 className="my-tables-title">Sus Formulas</h1>
      <button className="add-list-button" onClick={handleCreateListClick}>
        Crear Formula
      </button>
      <div className="lists-content">
        <div className="list-data">
          <span className="list-data" style={{fontWeight:'700'}}>Posicion</span>
          <span className="list-data" style={{fontWeight:'700'}}>Partido</span>
          <span className="list-data" style={{fontWeight:'700'}}>Id</span>
        </div>
        <ul className="lists-container">
          {formulas.map((formula, index) => (
            <li key={index}>
              <List position={formula.title} partyName={formula.partyName} formulaNumber ={formula.formulaNumber} />
            </li>
          ))}
        </ul>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lista Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="id">ID de formula:</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Ingrese ID de formula"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="partyId">Elegir partido:</label>
              <select
                id="partyId"
                name="partyId"
                value={formData.partyId}
                onChange={handleChange}
                required
              >
              <option value="">Seleccione un partido</option>
              {parties.length>0 && parties.map((party) => (
                <option key={party.uuid} value={party.uuid}>
                  {party.name}
                </option>
              ))}
              </select>
            </div>
            <button type="submit" className="modal-button">
              Siguiente
            </button>
          </form>
        </Modal.Body>
      </Modal>
        
      <Modal show={showPositionsModal} onHide={handleClosePositionsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ingrese los Candidatos de Posiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {positions.map((position, index) => (
            <div key={index} className="form-group">
              <h5>{position.title}</h5>
              <label>Subir archivo Excel para {position.title}:</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e, index)}
                required
              />
            </div>
          ))}
          <button type="submit" className="modal-button" onClick={handlePositionsSubmit}>
            Guardar
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserLists;
