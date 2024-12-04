import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PaymentModal from './ModalElectionRegistration/PaymentModal'; 
import './CustomTable.css';

const CustomTable = ({ title, columns = [], rows = [], onRowClick, handleAddSelected, handleDeleteSelected, showImage }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('paymentId');
    if (paymentId) {
      handleAddSelected();
    }
  }, [location.search, handleAddSelected]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.uuid);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleRowClick = (event, uuid) => {
    const selectedIndex = selectedRows.indexOf(uuid);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, uuid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const isSelected = (uuid) => selectedRows.indexOf(uuid) !== -1;

  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredRows = rows.filter((row) => {
    return columns.some((column) => {
      const value = row[column.field]?.toString().toLowerCase() || '';
      return normalizeString(value).includes(normalizeString(searchTerm));
    });
  });

  const handleAddClick = () => {
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('payment_id');
    if ((paymentId !== null && paymentId !== sessionStorage.getItem('paymentId'))) { sessionStorage.setItem('electionInProgress', 'true') }

    if (!(paymentId === null)) { sessionStorage.setItem('paymentId', paymentId) }

    if (sessionStorage.getItem('peeking an election') === 'false' && (!paymentId || (sessionStorage.getItem('electionInProgress') === 'false'))) {
      setIsModalOpen(true);
    } else {
      handleAddSelected();
    }
  };

  const handleModalConfirm = (amount) => {
    handleAddSelected();
  };

  return (
    <>
      <div className='table-section-header'>
        <h2 className='my-section-title'>{title}</h2>
        <div className='table-header-actions'>
          <TextField
            label="Buscar..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            className='table-search-field'
          />
          <Button
            variant="contained"
            onClick={handleAddClick}
          >
            <AddIcon />
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDeleteSelected(selectedRows)}
            disabled={selectedRows.length === 0}
          >
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <TableContainer
        className='table-section-container'
        component={Paper}
        style={{ width: '100%' }}
      >
        <Table stickyHeader sx={{ width: '100%' }} aria-label="customized table" >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" className="header-cell">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                  checked={rows.length > 0 && selectedRows.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all rows' }}
                />
              </TableCell>

              {showImage && (
                <TableCell padding="none" className="header-cell">
                </TableCell>
              )}

              {columns.map((column, index) => (
                <TableCell key={index} align={column.align || 'left'} className="header-cell">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, rowIndex) => {
                const isItemSelected = isSelected(row.uuid);
                return (
                  <TableRow className='table-row-data'
                    key={rowIndex}
                    onClick={(event) => onRowClick && onRowClick(row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRowClick(event, row.uuid);
                        }}
                        inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowIndex}` }}
                      />
                    </TableCell>

                    {showImage && row.logoUrl && (
                      <TableCell padding="checkbox">
                        <img
                          src={row.logoUrl}
                          alt={row.name}
                          style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginTop: '4px', marginBottom: '4px' }}
                        />
                      </TableCell>
                    )}

                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} align={column.align || 'left'}>
                        {row[column.field] || 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaymentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

export default CustomTable;