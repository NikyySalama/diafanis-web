import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import * as XLSX from 'xlsx';
import '../ModalSection.css';
import CustomTable from '../../CustomTable';
import CreateListModal from './CreateListModal';
import CreateCandidatesModal from './CreateCandidatesModal'
import EditFormulaModal from './EditFormulaModal'
import FormulaInfoModal from './FormulaInfoModal';
import { fetchParties, fetchFormulas, fetchPositions } from './fetchFormulaUtils';

const UserLists = () => {
  const { electionId, electionEditable } = useElection();
  const [parties, setParties] = useState([]);
  const [positions, setPositions] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [positionsData, setPositionsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [showEditFormulaModal, setShowEditFormulaModal] = useState(false);
  const [showFormulaInfoModal, setShowFormulaInfoModal] = useState(false);
  const [formData, setFormData] = useState({ partyUuid: '', partyName: '', id: '' });
  const [editFormulaData, setEditFormulaData] = useState({
    idNumber: '', 
    partyUuid: '',
    candidates: [],
    uuid: ''
  });

  useEffect(() => {
    fetchData();
    fetchPartiesData();
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedFormulas, fetchedPositions] = await Promise.all([fetchFormulas(electionId), fetchPositions(electionId)]);
      console.log("fetched formulas: ", fetchedFormulas);
      setFormulas(fetchedFormulas);
      setPositions(fetchedPositions);
      setPositionsData(new Array(fetchedPositions.length).fill(null));
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const fetchPartiesData = async () => {
    const data = await fetchParties(electionId);
    setParties(data);
  };

  const handleCreateListClick = () => {
    setFormData({ partyUuid: '', partyName: '', id: '' });
    setShowModal(true);
  };

  const handleEditFormulaClick = (formula) => {
    setEditFormulaData(formula);
    setShowFormulaInfoModal(true);
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
      fetchData();
    } catch (error) {
      console.error('Error en el envío de fórmulas o candidatos:', error);
    }
  };  

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
        setShowEditFormulaModal(false);
        fetchData();
      } else {
        console.error('Error al actualizar la fórmula:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
    console.log("formula subida: ", formulaDataToPatch);
  };

  const handleDeleteLists = async (formulas) => {
    if(!electionEditable){
      alert('La eleccion ya no es editable.');
      return;
    }
    
    try {
      await Promise.all(
        formulas.map(async (formula) => {
          const response = await fetch(`http://localhost:8080/api/electiveFormulas/${formula}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
  
          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }
        })
      );
      fetchData();
    } catch (error) {
      console.error('Error al eliminar formulas', error);
    }
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
        handleDeleteSelected={handleDeleteLists}
      />

      <CreateListModal
        show={showModal}
        onHide={() => setShowModal(false)}
        formData={formData}
        parties={parties}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <CreateCandidatesModal
        show={showPositionsModal}
        onHide={() => setShowPositionsModal(false)}
        handleFileUpload={handleFileUpload}
        handleSubmit={handlePositionsSubmit}
        positions={positions}
      />

      <FormulaInfoModal
        show={showFormulaInfoModal}
        onHide={() => setShowFormulaInfoModal(false)}
        handleEdit={() => {
          if(electionEditable){
            setShowEditFormulaModal(true); 
            setShowFormulaInfoModal(false);
          }
          else
            alert('La eleccion ya no es editable.');
        }}
        editFormulaData={editFormulaData}
        parties={parties}
      />

      <EditFormulaModal
        show={showEditFormulaModal}
        onHide={() => setShowEditFormulaModal(false)}
        setEditFormulaData={setEditFormulaData}
        handleSubmit={handleUpdateFormula}
        editFormulaData={editFormulaData}
        parties={parties}
      />
    </div>
  );
};

export default UserLists;