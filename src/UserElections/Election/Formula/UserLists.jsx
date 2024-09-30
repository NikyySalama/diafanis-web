import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import '../ModalSection.css';
import CustomTable from '../../CustomTable';

const UserLists = () => {
  const { electionId, electionEditable } = useElection();
  const [parties, setParties] = useState([]);
  const [positions, setPositions] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [showModalFormula, setShowModalFormula] = useState(false);
  const [formData, setFormData] = useState({ partyUuid: '', partyName: '', id: '' });
  const [positionsData, setPositionsData] = useState([]);
  const [editFormulaData, setEditFormulaData] = useState({
    idNumber: '', 
    partyUuid: '', 
    candidates: [],
    uuid: ''
  });

  useEffect(() => {
    fetchData();
    fetchParties();
  }, []);

  const fetchData = async () => {
    const [fetchedFormulas, fetchedPositions] = await Promise.all([fetchFormulas(), fetchPositions()]);
    console.log("formulas: ", fetchedFormulas);
    setFormulas(fetchedFormulas);
    setPositions(fetchedPositions);
    setPositionsData(new Array(fetchedPositions.length).fill(null));
  };

  const fetchParties = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/elections/${electionId}/parties`);
      if (response.ok) {
        const data = await response.json();
        setParties(data);
      } else {
        console.error('Error al obtener los partidos');
      }
    } catch (error) {
      console.error('Error en la solicitud de partidos', error);
    }
  };

  const fetchFormulas = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/elections/${electionId}/electionPositions`);
      if (response.ok) {
        const positions = await response.json();
        return positions.flatMap(position => 
          position.formulas.map(formula => ({
            title: position.title,
            idNumber: formula.idNumber,
            partyUuid: formula.party.uuid, // Asegúrate de usar `uuid` correctamente
            partyName: formula.party.name,
            candidates: formula.candidates,
            uuid: formula.uuid,
          }))
        );
      } else {
        throw new Error('Error al obtener las posiciones');
      }
    } catch (error) {
      console.error('Error en fetchFormulas:', error);
      return [];
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/elections/${electionId}/electionPositions`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Error en fetchPositions:', error);
      return [];
    }
  };

  const handleCreateListClick = () => {
    setFormData({ partyUuid: '', partyName: '', id: '' });
    setShowModal(true);
  };

  const handleEditFormulaClick = (formula) => {
    setEditFormulaData(formula);
    setShowModalFormula(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'partyUuid') {
      const selectedParty = parties.find(party => party.uuid === value);
      setFormData({ ...formData, partyUuid: value, partyName: selectedParty?.name || '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowPositionsModal(true);
  };

  const handleFileUpload = (e, positionId) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      const requiredColumns = ['DNI', 'name', 'lastName', 'imageUrl', 'role'];
      const fileColumns = Object.keys(data[0] || {});

      if (!requiredColumns.every(col => fileColumns.includes(col))) {
        alert('El archivo debe contener las columnas: DNI, name, lastName, imageUrl, role.');
        e.target.value = '';
        return;
      }

      const dniRegex = /^[0-9]+$/;
      if (!data.every(row => dniRegex.test(row.DNI))) {
        alert('El campo DNI debe contener solo valores numéricos.');
        e.target.value = '';
        return;
      }

      const candidates = data.map(row => ({
        role: row.role || 'Desconocido',
        docNumber: parseInt(row.DNI, 10) || 0,
        docType: 'DNI',
        name: row.name || 'Nombre Desconocido',
        surname: row.lastName || 'Apellido Desconocido',
        image: row.imageUrl || ''
      }));

      setPositionsData(prevData => {
        const updatedData = [...prevData];
        updatedData[positionId] = candidates;
        return updatedData;
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handlePositionsSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar si hay algún archivo no subido
    if (positions.some((_, index) => !positionsData[index]?.length)) {
      alert('Por favor, suba un archivo para cada posición.');
      return;
    }
  
    try {
      // Primero, subir las fórmulas y recolectar sus UUIDs
      const formulaPromises = positions.map((position, index) => {
        const formulaData = {
          title: 'title',
          partyUuid: formData.partyUuid,
          electionPositionUuid: position.uuid,
          idNumber: formData.id,
          electionUuid: electionId,
        };
  
        return fetch(`http://localhost:8080/api/electiveFormulas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulaData),
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }
          const text = await response.text();
          return text ? JSON.parse(text) : {};
        });
      });
  
      // Esperar a que todas las fórmulas se suban y obtener sus UUIDs
      const uploadedFormulas = await Promise.all(formulaPromises);
  
      // Crear y enviar los candidatos para cada fórmula
      for (let index = 0; index < uploadedFormulas.length; index++) {
        const uploadedFormula = uploadedFormulas[index];
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
            formulaUuid: uploadedFormula.uuid,
          },
        }));
  
        const response = await fetch(`http://localhost:8080/api/electiveFormulas/${uploadedFormula.uuid}/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidates),
        });
  
        if (!response.ok) {
          throw new Error(`Error en el envío de candidatos: ${response.status}`);
        }
      }
  
      // Cerrar el modal si todo salió bien
      setShowPositionsModal(false);
    } catch (error) {
      console.error('Error en el envío de fórmulas o candidatos:', error);
    }
  };  

  //TODO: change formula data

  const handleUpdateFormula = async (e) => {
    e.preventDefault();
    if (!editFormulaData.uuid || !editFormulaData.partyUuid) return;

    const formulaDataToPatch = {
      idNumber: editFormulaData.idNumber,
      partyUuid: editFormulaData.partyUuid,
    }

    try {
      const response = await fetch(`http://localhost:8080/api/electiveFormulas/${editFormulaData.uuid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulaDataToPatch),
      });

      if (response.ok) {
        const updatedFormula = await response.json();
        setFormulas(formulas.map(f => f.uuid === updatedFormula.uuid ? updatedFormula : f));
        setShowModalFormula(false);
      } else {
        console.error('Error al actualizar la fórmula:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
    console.log("formula subida: ", formulaDataToPatch);
  };

  const columns = [
    { label: 'Posición', field: 'title' },
    { label: 'Partido', field: 'partyName' },
    { label: 'ID', field: 'idNumber' },
  ];

  return (
    <div className="my-section">
      <CustomTable 
        title="Sus Fórmulas" 
        columns={columns} 
        rows={formulas} 
        onRowClick={handleEditFormulaClick} 
        handleAddSelected={handleCreateListClick} 
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Datos de la Lista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="id">ID de fórmula:</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Ingrese ID de fórmula"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="partyUuid">Partido:</label>
              <select
                id="partyUuid"
                name="partyUuid"
                value={formData.partyUuid}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Partido</option>
                {parties.map((party) => (
                  <option key={party.uuid} value={party.uuid}>
                    {party.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Crear Lista</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showPositionsModal} onHide={() => setShowPositionsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Posiciones y Candidatos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePositionsSubmit}>
            {positions.map((position, index) => (
              <div key={position.uuid} className="form-group">
                <label htmlFor={`position${index}`}>{position.title}</label>
                <input
                  type="file"
                  id={`position${index}`}
                  name={`position${index}`}
                  accept=".xlsx, .xls"
                  onChange={(e) => handleFileUpload(e, index)}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Subir Fórmulas</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showModalFormula} onHide={() => setShowModalFormula(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Fórmula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateFormula}>
            <div className="form-group">
              <label htmlFor="id">ID de fórmula:</label>
              <input
                type="text"
                id="id"
                name="idNumber"
                value={editFormulaData.idNumber}
                onChange={(e) => setEditFormulaData({ ...editFormulaData, idNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="partyUuid">Partido:</label>
              <select
                id="partyUuid"
                name="partyUuid"
                value={editFormulaData.partyUuid}
                onChange={(e) => setEditFormulaData({ ...editFormulaData, partyUuid: e.target.value })}
                required
              >
                <option value="">Seleccionar Partido</option>
                {parties.map((party) => (
                  <option key={party.uuid} value={party.uuid}>
                    {party.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserLists;