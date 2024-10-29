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
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import '../../CustomTable.css';

const AuthoritiesTable = ({ title, columns = [], rows = [], handleAddSelected, handleDeleteSelected }) => {
    const theme = useTheme();

    const [expandedRows, setExpandedRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedAuthorities, setSelectedAuthorities] = useState({});

    const handleExpandClick = (uuid) => {
        setExpandedRows(prev => 
            prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]
        );
    };

    const handleSelectRow = (uuid) => {
        const isSelected = selectedRows.includes(uuid);
        const newSelectedRows = isSelected
            ? selectedRows.filter(id => id !== uuid)
            : [...selectedRows, uuid];
        setSelectedRows(newSelectedRows);

        // Seleccionar/desmarcar todas las autoridades si la fila se selecciona/deselecciona
        setSelectedAuthorities(prev => ({
            ...prev,
            [uuid]: isSelected ? [] : rows.find(row => row.uuid === uuid).authorities.map(auth => auth.docNumber),
        }));
    };

    const handleAuthoritySelect = (rowUuid, docNumber) => {
        setSelectedAuthorities(prev => {
            const currentSelected = prev[rowUuid] || [];
            const isSelected = currentSelected.includes(docNumber);
            return {
                ...prev,
                [rowUuid]: isSelected
                    ? currentSelected.filter(id => id !== docNumber)
                    : [...currentSelected, docNumber],
            };
        });
    };

    const isExpanded = (uuid) => expandedRows.includes(uuid);
    const isSelected = (uuid) => selectedRows.includes(uuid);

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
                    <Button
                        variant="contained"
                        disabled={selectedRows.length === 0}
                        onClick={() => handleDeleteSelected(selectedRows)}
                    >
                        <DeleteIcon />
                    </Button>
                </div>
            </div>
            <TableContainer className="table-section-container" component={Paper}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="authorities table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" className="header-cell">
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                                    checked={rows.length > 0 && selectedRows.length === rows.length}
                                    onChange={(e) => {
                                        setSelectedRows(
                                            e.target.checked ? rows.map(row => row.uuid) : []
                                        );
                                    }}
                                />
                            </TableCell>
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
                                <TableCell colSpan={columns.length + 2} align="center">
                                    No hay datos disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, rowIndex) => {
                                const isRowExpanded = isExpanded(row.uuid);
                                const isRowSelected = isSelected(row.uuid);

                                return (
                                    <React.Fragment key={rowIndex}>
                                        <TableRow className="table-row-data" selected={isRowSelected}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isRowSelected}
                                                    onChange={() => handleSelectRow(row.uuid)}
                                                />
                                            </TableCell>
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
                                                <TableCell colSpan={columns.length + 2} style={{ padding: '16px' }}>
                                                    {row.authorities && row.authorities.length > 0 ? (
                                                        <Table size="small" aria-label="authorities">
                                                            <TableHead>
                                                                <TableRow>
                                                                    {/*<TableCell padding="checkbox">
                                                                        <Checkbox
                                                                            indeterminate={
                                                                                selectedAuthorities[row.uuid]?.length > 0 &&
                                                                                selectedAuthorities[row.uuid]?.length < row.authorities.length
                                                                            }
                                                                            checked={
                                                                                row.authorities.length > 0 &&
                                                                                selectedAuthorities[row.uuid]?.length === row.authorities.length
                                                                            }
                                                                            onChange={(e) => {
                                                                                setSelectedAuthorities(prev => ({
                                                                                    ...prev,
                                                                                    [row.uuid]: e.target.checked
                                                                                        ? row.authorities.map(auth => auth.docNumber)
                                                                                        : [],
                                                                                }));
                                                                            }}
                                                                        />
                                                                    </TableCell>*/}
                                                                    <TableCell />
                                                                    <TableCell style={{ fontWeight: 'bold' }}>Doc Number</TableCell>
                                                                    <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                                                    <TableCell style={{ fontWeight: 'bold' }}>Apellido</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {row.authorities.map((authority, authorityIndex) => (
                                                                    <TableRow key={authorityIndex}>
                                                                        <TableCell padding="checkbox">
                                                                            <Checkbox
                                                                                checked={selectedAuthorities[row.uuid]?.includes(authority.docNumber) || false}
                                                                                onChange={() => handleAuthoritySelect(row.uuid, authority.docNumber)}
                                                                            />
                                                                        </TableCell>
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