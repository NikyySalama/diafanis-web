import React,{ useState } from 'react';
import './NavbarUserElection.css'
import isotipo from '../Common//Isotipo.png' 
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const NavbarUserElection = () => {
  const [openLogout, setOpenLogout] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/`);
  };
  
  const handleOpenLogin = () => setOpenLogout(true);
  

  return (
    <div className="navbar-user-election">
      <div className="logo-with-name" onClick={handleClick}>
        <img className="diafanis-logo" src={isotipo}></img>
        <h1 className="diafanis-title">Diafanis</h1>
      </div>
      <Button
        sx={{
          color: 'var(--primary-color)',
          backgroundColor: 'var(--background-color)',
          height: '80%',
          padding: '0.5% 1%',
          marginRight: '0.5em',
          cursor: 'pointer',
          fontSize: '1em',
          ":hover": {
            transform: 'scale(1.025)'
          },
          fontFamily: 'Inter',
          marginLeft: 'auto',
          fontWeight: 700,
          mt: '0.25em',
          border: '0.25px solid black',
        }}
        variant="contained"
        onClick={handleOpenLogin}
      >
        Cerrar sesion
      </Button>
      <ModalLogout open={openLogout} setOpenState={setOpenLogout}/>
    </div>
  );
};



const ModalLogout = ({ open, setOpenState }) => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    setOpenState(false);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('jwt');
    navigate(`/`);
  };
  const handleCloseLogin = () => {
    setOpenState(false);
  };

  
  return (
    <Modal
      open={open}
      onClose={handleCloseLogin}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '27em',
        bgcolor: 'background.paper',
        border: '1px solid #000',
        borderRadius: 2,
        height: 'fit-content',
        backgroundImage: 'url("../../Common/Group35593.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        p: 4,
      }}  >

        <Typography  align="center"  sx={{ mt: 3, ml: 0.75,color:'black' }} id="modal-logout-title" variant="h5">
          Esta por cerrar sesion
        </Typography>
        <Typography  align="center"  sx={{ mt: 3, ml: 0.75,color:'black' }} id="modal-logout-action" variant="h6">
          Desea continuar?
        </Typography>
        
        <Button 
          sx={{
            color: 'var(--background-color)',
            backgroundColor: 'var(--primary-color)',
            cursor: 'pointer',
            fontFamily: 'Inter',
            mt: 4,
            ml: 0.75,
            fontWeight: 700,
            width: '24.5em',
            border: '0.25px solid black',
          }} 
          variant="contained" type='button' onClick={handleLogout} >
          Confirmar
        </Button>
        <Button 
          sx={{
            color: 'var(--primary-color)',
            backgroundColor: 'var(--background-color)',
            cursor: 'pointer',
            fontFamily: 'Inter',
            mt: 4,
            ml: 0.75,
            fontWeight: 700,
            width: '24.5em',
            border: '0.25px solid black',
          }} 
          variant="contained"  type='button' onClick={handleCloseLogin}>
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};


export default NavbarUserElection;