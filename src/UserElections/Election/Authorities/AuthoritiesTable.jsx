import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import '../../CustomTable.css';

const AuthoritiesTable = ({ title, columns = [], rows = [], handleAddSelected }) => {
    const theme = useTheme();

    // Estado para manejar qué filas están expandidas
    const [expandedRows, setExpandedRows] = useState([]);

    // Manejar la expansión o colapso de una fila
    const handleExpandClick = (uuid) => {
        const isExpanded = expandedRows.includes(uuid);
        let newExpandedRows;

        if (isExpanded) {
            newExpandedRows = expandedRows.filter((rowUuid) => rowUuid !== uuid);
        } else {
            newExpandedRows = [...expandedRows, uuid];
        }

        setExpandedRows(newExpandedRows);
    };

    // Verificar si la fila está expandida
    const isExpanded = (uuid) => expandedRows.includes(uuid);

    return (
        <>
            <div className='table-section-header'>
                <h2 className='my-section-title'>{title}</h2>
                <div className='table-header-actions'>
                <Button
                    variant="contained"
                    onClick={handleAddSelected}
                >
                    <AddIcon />
                </Button>
                </div>
            </div>
            <TableContainer className="table-section-container" component={Paper}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="authorities table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell key={index} align={column.align || 'left'} className="header-cell">
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell className="header-cell" />
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
                                const isRowExpanded = isExpanded(row.uuid);
                                return (
                                    <React.Fragment key={rowIndex}>
                                        <TableRow className="table-row-data">
                                            {columns.map((column, colIndex) => (
                                                <TableCell key={colIndex} align={column.align || 'left'}>
                                                    {row[column.field] || 'N/A'}
                                                </TableCell>
                                            ))}
                                            <TableCell padding="none">
                                                <IconButton
                                                    onClick={() => handleExpandClick(row.uuid)}
                                                    aria-label="expand row"
                                                >
                                                    {isRowExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        {isRowExpanded && (
                                            <TableRow>
                                                <TableCell colSpan={columns.length + 1} style={{ padding: '16px' }}>
                                                    {row.authorities && row.authorities.length > 0 ? (
                                                        <Table size="small" aria-label="authorities">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell style={{ fontWeight: 'bold' }}>Doc Number</TableCell>
                                                                    <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                                                    <TableCell style={{ fontWeight: 'bold' }}>Apellido</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {row.authorities.map((authority, authorityIndex) => (
                                                                    <TableRow key={authorityIndex}>
                                                                        <TableCell>{authority.docNumber}</TableCell>
                                                                        <TableCell>{authority.name}</TableCell>
                                                                        <TableCell>{authority.lastName}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <div>No hay autoridades de mesa</div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default AuthoritiesTable;