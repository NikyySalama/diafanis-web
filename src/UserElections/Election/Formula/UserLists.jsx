import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import '../ModalSection.css';
import CustomTable from '../../CustomTable';

const UserLists = () => {
  const electionId = useElection();
  const [parties, setParties] = useState([]);
  const [positions, setPositions] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [formData, setFormData] = useState({ partyId: '', partyName: '', id: '' });
  const [positionsData, setPositionsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFormulas = await fetchFormulas();
      const fetchedPositions = await fetchPositions();

      setFormulas(fetchedFormulas);
      setPositions(fetchedPositions);
    };
    fetchData();
    fetchParties();
  }, []);

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
        const formulas = positions.flatMap(position =>
          position.formulas.map(formula => ({
            title: position.title,
            formulaNumber: formula.idNumber,
            partyName: formula.party.name,
          }))
        );
        return formulas;
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
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error al obtener las posiciones');
      }
    } catch (error) {
      console.error('Error en fetchPositions:', error);
      return [];
    }
  };

  const handleCreateListClick = () => {
    setFormData({ partyId: '', partyName: '', id: '' });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'partyId') {
      const selectedParty = parties.find(party => party.uuid === value);
      setFormData({ ...formData, partyId: value, partyName: selectedParty ? selectedParty.name : '' });
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

      const candidates = data.map(row => ({
        role: row.role || 'Desconocido',
        docNumber: parseInt(row.DNI, 10) || 0,
        docType: 'DNI',
        name: row.name || 'Nombre Desconocido',
        surname: row.lastName || 'Apellido Desconocido',
        image: row.imageUrl || '',
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

    try {
      const postPromises = positions.map(async (position, index) => {
        const candidates = positionsData[index]?.map((candidate, candidateIndex) => ({
          role: candidate.role,
          imageUrl: candidate.image,
          zindex: candidateIndex,
          data: {
            docNumber: candidate.docNumber,
            docType: candidate.docType,
            name: candidate.name,
            lastName: candidate.surname,
          },
        })) || [];

        const formulaData = {
          title: 'title',
          partyUuid: formData.partyId,
          idNumber: formData.id,
          candidates,
        };

        const response = await fetch(`http://localhost:8080/api/electiveFormulas/${position.uuid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulaData),
        });

        if (!response.ok) throw new Error(`Error al enviar la fórmula para ${position.title}`);
        return response.json();
      });

      const results = await Promise.all(postPromises);
      results.forEach((result, index) => console.log(`Fórmula subida para ${positions[index].title}:`, result));
    } catch (error) {
      console.error('Error en el envío de fórmulas:', error);
    }

    setShowPositionsModal(false);
  };

  const columns = [
    { label: 'Posición', field: 'title' },
    { label: 'Partido', field: 'partyName' },
    { label: 'ID', field: 'formulaNumber' }
  ];

  return (
    <div className="my-section">
      <div className="my-section-header">
        <h2 className="my-section-title">Sus Fórmulas</h2>
        <button className="add-section-button" onClick={handleCreateListClick}>Crear Fórmula</button>
      </div>
      
      <CustomTable columns={columns} rows={formulas} />

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
              <label htmlFor="partyId">Elegir partido:</label>
              <select
                id="partyId"
                name="partyId"
                value={formData.partyId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un partido</option>
                {parties.map(party => (
                  <option key={party.uuid} value={party.uuid}>{party.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="modal-button">Siguiente</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showPositionsModal} onHide={() => setShowPositionsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ingrese los Candidatos de las Posiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {positions.map((position, index) => (
            <div key={index} className="form-group">
              <h5>{position.title}</h5>
              <label>Subir archivo Excel para {position.title}:</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={e => handleFileUpload(e, index)}
                required
              />
            </div>
          ))}
          <button type="submit" className="modal-button" onClick={handlePositionsSubmit}>Guardar</button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserLists;