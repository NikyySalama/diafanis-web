import React, { useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './CustomTable.css';

const CustomTable = ({ title, columns = [], rows = [], onRowClick, handleAddSelected, handleDeleteSelected }) => {
  const theme = useTheme();
  
  // Estado para manejar las filas seleccionadas
  const [selectedRows, setSelectedRows] = useState([]);

  // Manejar la selección de todas las filas
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.uuid);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  // Manejar la selección individual de cada fila
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

  // Verificar si la fila está seleccionada
  const isSelected = (uuid) => selectedRows.indexOf(uuid) !== -1;

  return (
    <>
      <div className='table-section-header'>
        <h2 className='my-section-title'>{title}</h2>
        <div className='table-header-actions'>
          <Button
            variant="contained"
            onClick={handleAddSelected}
            aria-label="Crear Eleccion"
          >
            <AddIcon />
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDeleteSelected(selectedRows)}
            disabled={selectedRows.length === 0}
            aria-label="Borrar Eleccion"
          >
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <TableContainer
        className='table-section-container'
        component={Paper}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {/* Checkbox de selección de todas las filas */}
              <TableCell padding="checkbox" className="header-cell">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                  checked={rows.length > 0 && selectedRows.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all rows' }}
                />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell key={index} align={column.align || 'left'}  className="header-cell">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => {
                const isItemSelected = isSelected(row.uuid);
                return (
                  <TableRow className='table-row-data'
                    key={rowIndex}
                    onClick={(event) => onRowClick && onRowClick(row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                  >
                    {/* Checkbox para cada fila */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRowClick(event, row.uuid)
                        }
                        }
                        inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowIndex}` }}
                      />
                    </TableCell>
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
    </>
  );
};

export default CustomTable;