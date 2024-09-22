import React from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { lighten } from '@mui/material/styles';

const CustomTable = ({ columns = [], rows = [], onRowClick }) => {
  const theme = useTheme();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.secondary.main,
              '& th': {
                color: theme.palette.common.white,
                fontWeight: 'bold',
              },
            }}
          >
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align || 'left'}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                sx={{
                  backgroundColor:
                    rowIndex % 2 === 0
                      ? theme.palette.action.hover
                      : theme.palette.background.paper,
                  '&:hover': {
                    backgroundColor: lighten(theme.palette.secondary.main, 0.8),
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: onRowClick ? 'pointer' : 'default',
                }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} align={column.align || 'left'}>
                    {row[column.field] || 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;