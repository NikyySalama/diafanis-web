import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import * as XLSX from 'xlsx';
import '../ModalSection.css';
import CustomTable from '../../CustomTable';
import CreateListModal from './CreateListModal';
import CreateCandidatesModal from './CreateCandidatesModal'
import EditFormulaModal from './EditFormulaModal'
import FormulaInfoModal from './FormulaInfoModal';
import { fetchFormulas, fetchPositions } from './fetchFormulaUtils';
import sanitizeInput from '../../../Common/validatorInput';
import checkIMGByURL from '../../../Common/validatorURL';
import { fetchParties } from '../Parties/PartiesUtils';
import CustomPieChart from '../../CustomPieChart';
import ErrorLimitModal from '../ErrorLimitModal';

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
  const [pieData, setPieData] = useState([]);
  const [modalErrorData, setErrorModalData] = useState({ isOpen: false, message: '', maxAllowed: null });

  const getRandomColor = (index) => {
    const baseColors = [
      'rgb(255, 90, 50)', // Naranja
      'rgb(28, 89, 255)', // Azul
      'rgb(255, 206, 86)', // Amarillo
      'rgb(75, 192, 192)', // Turquesa
      'rgb(153, 102, 255)', // Púrpura
      'rgb(255, 159, 64)', // Naranja claro
      'rgb(180, 180, 180)', // Gris oscuro
      'rgb(255, 51, 51)',  // Rojo claro
      'rgb(102, 204, 0)',  // Verde claro
      'rgb(0, 153, 255)',  // Azul claro
      'rgb(204, 51, 255)', // Fuccia
      'rgb(105, 255, 200)',
      'rgb(128, 128, 128)', // Gris
      'rgb(51, 204, 255)', // Turquesa claro
      'rgb(102, 51, 255)'  // Azul violeta
    ];
  
    const darkenColor = (rgb) => {
      const [r, g, b] = rgb
        .match(/\d+/g)
        .map((value) => Math.max(0, parseInt(value) - 50)); // Restar 40 a cada componente
      return `rgb(${r}, ${g}, ${b})`;
    };
  
    const baseIndex = index % baseColors.length;
    const baseColor = baseColors[baseIndex];
  
    return index >= baseColors.length ? darkenColor(baseColor) : baseColor;
  };  

  useEffect(() => {
    fetchData();
    fetchPartiesData();
  }, []);


  useEffect(() => {
    const chartData = positions.map((position, index) => ({
      name: position.title,
      color: getRandomColor(index),
      value: formulas.filter(formula => formula.title === position.title).length
    }));
    setPieData(chartData);
  }, [positions, formulas]);

  const fetchData = async () => {
    try {
      const [fetchedFormulas, fetchedPositions] = await Promise.all([fetchFormulas(electionId), fetchPositions(electionId)]);
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
      setFormData({ ...formData, partyUuid: value, partyName: sanitizeInput(selectedParty?.name) || '' });
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
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(`.${fileExtension}`)) {
      alert('Por favor suba un archivo Excel válido (.xls o .xlsx).');
      return;
    }
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      const requiredColumns = ['docNumber', 'docType', 'name', 'lastName', 'imageUrl', 'role'];
      const fileColumns = Object.keys(data[0] || {});

      if (!requiredColumns.every(col => fileColumns.includes(col))) {
        alert('El archivo debe contener las columnas: docNumber, docType, name, lastName, imageUrl, role.');
        e.target.value = '';
        return;
      }

      const docNumRegex = /^[0-9]+$/;
      if (!data.every(row => docNumRegex.test(row.docNumber))) {
        alert('El campo docNumber debe contener solo valores numéricos.');
        e.target.value = '';
        return;
      }

      const candidates = data.map(row => ({
        role: sanitizeInput(row.role) || 'Desconocido',
        docNumber: sanitizeInput(parseInt(row.docNumber, 10)) || 0,
        docType: row.docType,
        name: sanitizeInput(row.name) || 'Nombre Desconocido',
        lastName: sanitizeInput(row.lastName) || 'Apellido Desconocido',
        image: row.imageUrl ? row.imageUrl : ''
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
  
    // Verificar si hay al menos una posición con datos
    const validPositions = positions.filter((_, index) => positionsData[index]?.length);
    if (validPositions.length == 0) {
      alert('Por favor, complete alguna posición.');
      return;
    }
  
    try {
      // Subir las fórmulas y recolectar sus UUIDs para las posiciones válidas
      const formulaPromises = validPositions.map((position, index) => {
        const validIndex = positions.findIndex((pos) => pos.uuid === position.uuid); // Para mapear al índice correcto
        const formulaData = {
          title: 'title',
          partyUuid: formData.partyUuid,
          electionPositionUuid: position.uuid,
          idNumber: sanitizeInput(formData.id),
          electionUuid: electionId,
        };
  
        return fetch(`${process.env.REACT_APP_API_URL}/api/electiveFormulas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
          },
          body: JSON.stringify(formulaData),
        }).then(async (response) => {
          const responseBody = await response.json().catch(() => null);
          if (!response.ok) {
            console.error('Error al guardar la fórmula:', {
              status: response.status,
              statusText: response.statusText,
              errorBody: responseBody,
            });  

            if (responseBody?.message?.startsWith("El número total de ")) {
              setShowPositionsModal(false);
              setErrorModalData({
                isOpen: true,
                message: responseBody.message,
                maxAllowed: responseBody.maxAllowed,
              });
            }
            throw new Error(`Error en la creación de la fórmula: ${response.status}`);          
          }
          return { ...responseBody, index: validIndex };
        });
      });
  
      // Esperar a que todas las fórmulas se suban y obtener sus UUIDs
      const uploadedFormulas = await Promise.all(formulaPromises);
  
      // Enviar candidatos asociados a cada fórmula
      const candidatePromises = uploadedFormulas.map(({ uuid, index }) => {
        const candidates = positionsData[index].map((candidate, candidateIndex) => ({
          role: sanitizeInput(candidate.role),
          imageUrl: checkIMGByURL(candidate.image) ? candidate.image : '',
          zindex: sanitizeInput(candidateIndex),
          data: {
            docNumber: sanitizeInput(candidate.docNumber),
            docType: sanitizeInput(candidate.docType),
            name: sanitizeInput(candidate.name),
            lastName: sanitizeInput(candidate.lastName),
            imageUrl: checkIMGByURL(candidate.image) ? candidate.image : '',
            formulaUuid: uuid,
          },
        }));
  
        return fetch(`${process.env.REACT_APP_API_URL}/api/electiveFormulas/${uuid}/candidates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
          },
          body: JSON.stringify(candidates),
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error(`Error en el envío de candidatos: ${response.status}`);
          }
          return response.json();
        });
      });
  
      // Esperar a que todos los candidatos se envíen
      await Promise.all(candidatePromises);
  
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
      idNumber: sanitizeInput(editFormulaData.idNumber),
      partyUuid: editFormulaData.partyUuid,
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/electiveFormulas/${editFormulaData.uuid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
        },
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
  };

  const handleDeleteLists = async (formulas) => {
    if (!electionEditable) {
      alert('La eleccion ya no es editable.');
      return;
    }

    try {
      await Promise.all(
        formulas.map(async (formula) => {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/electiveFormulas/${formula}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
            },
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
      <div style={{ display: 'flex' }}>
        <div style={{ width: '60vw' }}>
          <CustomTable
            title="Fórmulas"
            columns={columns}
            rows={formulas}
            onRowClick={handleEditFormulaClick}
            handleAddSelected={handleCreateListClick}
            handleDeleteSelected={handleDeleteLists}
          />
        </div>
        <div style={{ paddingLeft: '20px', width: '40vw' }}>
          <div style={{
            borderRadius: '15px',
            padding: '10px'
          }}>
            <h3>Distribución de Fórmulas por Posición</h3>
            <CustomPieChart pieData={pieData} />
          </div>
        </div>
      </div>

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
          if (electionEditable) {
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

      <ErrorLimitModal
          isOpen={modalErrorData.isOpen}
          message={modalErrorData.message}
          maxAllowed={modalErrorData.maxAllowed}
          onClose={() => setErrorModalData({ ...modalErrorData, isOpen: false })}
      />
    </div>
  );
};

export default UserLists;