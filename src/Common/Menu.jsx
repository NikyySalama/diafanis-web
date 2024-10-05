
import './Menu.css';
import isotipo from './Isotipo.png'
import { Form, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';



const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: index < currentStep ? 'green' : '#360269',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'background-color 0.3s ease',
            }}
          >
            {index < currentStep ? (
              <CheckIcon />
            ) : (
              <Typography sx={{ color: 'white' }}> {index + 1}</Typography> 
            )}
          </Box>

          
          {index < totalSteps - 1 && (
            <Box
              sx={{
                width: '40px',
                height: '2px',
                backgroundColor: index < currentStep ? 'green' : '#020246',
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

const Signin = ({ openState, setOpenState }) => {
  const [step, setStep] = useState(0);
  const handleBack = () => setStep((prevStep) => prevStep - 1);
  const handleCloseSignin = () => {
    setOpenState(false);
    setFormValues({
      Email: '',
      Contraseña: '',
      Usuario: '',
      Nombre: '',
      Apellido: '',
      Imagen: ''
    });
  };

  const [formValues, setFormValues] = useState({
    Email: '',
    Contraseña: '',
    Usuario: '',
    Nombre: '',
    Apellido: '',
    Imagen: ''
  });

  const [errors, setErrors] = useState({
    Email: '',
    Contraseña: '',
    Usuario: '',
    Nombre: '',
    Apellido: '',
  });

  const [touched, setTouched] = useState({
    Email: false,
    Contraseña: false,
    Usuario: false,
    Nombre: false,
    Apellido: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
    validateField(name, formValues[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    switch (fieldName) {
      case 'Email':
        if (!value) {
          error = 'Email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email formato invalido';
        }
        break;
      case 'Contraseña':
        if (!value) {
          error = 'Contraseña es obligatorio';
        } else if (value.length < 6) {
          error = 'Contraseña debe tener al menos 6 letras';
        }
        break;
      case 'Usuario':
      case 'Nombre':
      case 'Apellido':
        if (!value) {
          error = `${fieldName} es obligatorio`;
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(formValues).forEach((fieldName) => {
      validateField(fieldName, formValues[fieldName]);
      if (errors[fieldName]) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setStep(0);
      setTouched({
        Email: false,
        Contraseña: false,
        Usuario: false,
        Nombre: false,
        Apellido: false,
      });
      setErrors({
        Email: '',
        Contraseña: '',
        Usuario: '',
        Nombre: '',
        Apellido: '',
      });
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formValues.Usuario,
            password: formValues.Contraseña,
            lastName: formValues.Apellido,
            name: formValues.Nombre,
            email: formValues.Email,
            imageUrl: formValues.Imagen,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Form submitted successfully', data);
        } else {
          const errorMessage = await response.json();
          console.error('Error submitting form:', response.status, errorMessage);
        }
      } catch (error) {
        console.error('Network or server error:', error);
      }

      handleCloseSignin();
    }
  };

  return (
    <Modal
      open={openState}
      onClose={handleCloseSignin}
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
        backgroundImage: 'url("./Group35593.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        p: 4,
      }} component="form" onSubmit={handleSubmit}>
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <img
            src={isotipo}
            alt="Description of image"
            style={{
              maxWidth: '10em',
              height: 'min-content',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StepIndicator currentStep={step} totalSteps={2} />
        </Box>
        <Typography sx={{ mt: 3, ml: 0.75 }} variant="h5">
          Cree su cuenta
        </Typography>

        {step === 0 && (
          <Box>
            <InputField
              label="Usuario"
              placeholder=""
              onChangeMethod={handleInputChange}
              onBlurMethod={handleBlur}
              values={formValues}
              error={touched.Usuario && !!errors.Usuario}
              helperText={touched.Usuario && errors.Usuario}
              required
            />
            <PasswordInput
              onChangeMethod={handleInputChange}
              onBlurMethod={handleBlur}
              values={formValues}
              error={touched.Contraseña && !!errors.Contraseña}
              helperText={touched.Contraseña && errors.Contraseña}
              required
            />
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography sx={{ m: 1, mb: 0, mt: 3 }}>Informacion personal</Typography>
            <InputField
              label="Email"
              placeholder="123@gmail.com"
              onChangeMethod={handleInputChange}
              onBlurMethod={handleBlur}
              values={formValues}
              error={touched.Email && !!errors.Email}
              helperText={touched.Email && errors.Email}
              required
            />
            <InputField
              label="Nombre"
              placeholder=""
              onChangeMethod={handleInputChange}
              onBlurMethod={handleBlur}
              values={formValues}
              error={touched.Nombre && !!errors.Nombre}
              helperText={touched.Nombre && errors.Nombre}
              required
            />
            <InputField
              label="Apellido"
              placeholder=""
              onChangeMethod={handleInputChange}
              onBlurMethod={handleBlur}
              values={formValues}
              error={touched.Apellido && !!errors.Apellido}
              helperText={touched.Apellido && errors.Apellido}
              required
            />
            <InputField
              label="Imagen"
              placeholder="URL"
              onChangeMethod={handleInputChange}
              values={formValues}
            />
          </Box>
        )}

        {step === 2 && (
          <Typography variant='body2' sx={{ m: 0, mb: 0, mt: 3 }}>
            Paso final, realice el pago del servicio a traves del cbu
          </Typography>
        )}

        <Box align="center" sx={{ mt: 6 }}>
          <Button
            sx={{
              color: 'var(--primary-color)',
              backgroundColor: 'var(--background-color)',
              cursor: 'pointer',
              fontFamily: 'Inter',
              fontWeight: 700,
              border: '0.25px solid black',
              width: '9em',
              mr: 2,
            }}
            variant="contained"
            disabled={step === 0}
            onClick={handleBack}
          >
            Atras
          </Button>
          {step < 2 ? (
            <Button
              sx={{
                color: 'var(--background-color)',
                backgroundColor: 'var(--primary-color)',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontWeight: 700,
                border: '0.25px solid black',
                width: '9em',
              }}
              variant="contained"
              onClick={handleNext}
              type='button'
            >
              Continuar
            </Button>
          ) : (
            <Button
              sx={{
                color: 'var(--background-color)',
                backgroundColor: 'var(--primary-color)',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontWeight: 700,
                width: '9em',
                border: '0.25px solid black',
              }}
              variant="contained"
              type="submit"
            >
              Registrarme
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

const InputField = ({ label, placeholder, onChangeMethod, onBlurMethod, values, error, helperText, required }) => {
  return (
    <FormControl sx={{ m: 1, width: '21em' }} variant="standard" error={error} required={required}>
      <InputLabel sx={{ color: 'grey' }} htmlFor={`standard-adornment-${label}`}>{label}</InputLabel>
      <Input
        id={`standard-adornment-${label}`}
        type="text"
        placeholder={placeholder}
        name={label}
        onChange={onChangeMethod}
        onBlur={onBlurMethod}
        value={values[label]}
        autoComplete="off"
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const PasswordInput = ({ onChangeMethod, onBlurMethod, values, error, helperText, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ m: 1, width: '21em' }} variant="standard" error={error} required={required}>
      <InputLabel sx={{ color: 'grey' }} htmlFor="standard-adornment-password">Contraseña</InputLabel>
      <Input
        id="standard-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name='Contraseña'
        value={values['Contraseña']}
        onChange={onChangeMethod}
        onBlur={onBlurMethod}
        autoComplete="current-password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};





const Login = ({ open, setOpenState }) => {
  const navigate = useNavigate();


  const [formValues, setFormValues] = useState({
    Usuario: '',
    Contraseña: '',
  });

  const handleCloseLogin = () => {
    setOpenState(false); 
    setFormValues({
      Usuario: '',
      Contraseña: '',
    });
  };



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formValues.Usuario,
          password: formValues.Contraseña,
        }),

      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('jwt', data.token);
        sessionStorage.setItem('user', data.username);
        navigate(`/userElections`);
      } else {
        const errorMessage = await response.json();
        console.error('Error submitting form:', response.status, errorMessage);
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
    handleCloseLogin(); 
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
        backgroundImage: 'url("./Group35593.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        p: 4,
      }} component="form" onSubmit={handleSubmit} >
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <img
            src={isotipo}
            alt="Description of image"
            style={{
              maxWidth: '10em',
              height: 'min-content',
            }}
          />
        </Box>
        <Typography sx={{ mt: 3, ml: 0.75 }} id="multi-step-modal-title" variant="h5">
          Inicie sesion
        </Typography>

        <Box>
          <InputField label={"Usuario"} placeholder={""} onChangeMethod={handleInputChange} values={formValues} />
          <PasswordInput onChangeMethod={handleInputChange} values={formValues} />
        </Box>

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
          variant="contained"
          type='submit'>
          Iniciar sesion
        </Button>
      </Box>
    </Modal>
  );
};








const Menu = () => {

  const userIsActive = sessionStorage.getItem('user') && sessionStorage.getItem('user').trim() !== '';
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);

  const handleOpenLogin = () => setOpenLogin(true);

  const handleOpenSignin = () => setOpenSignin(true);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/`);
  };

  const handleClickUser = () => {
    navigate(`/userElections`);
  };

  return (
    <div className="menu">
      <div className='menu-button' onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img className="diafanis-icon" src={isotipo} alt="Isotipo" />
        <Typography variant='h5' className="diafanis">Diafanis</Typography>
      </div>
      {!userIsActive ? (
        <>
          <Button
            sx={{
              color: 'var(--primary-color)',
              backgroundColor: 'var(--background-color)',
              height: '80%',
              padding: '0.5% 1%',
              marginRight: '0.5em',
              cursor: 'pointer',
              fontSize: '1em',
              fontFamily: 'Inter',
              marginLeft: 'auto',
              fontWeight: 700,
              border: '0.25px solid black',
            }}
            variant="contained"
            className="my-elections-button"
            onClick={handleOpenSignin}
          >
            Crear usuario
          </Button>
          <Button
            sx={{
              color: 'var(--background-color)',
              backgroundColor: 'var(--primary-color)',
              height: '80%',
              padding: '0.5% 1%',
              border: '0.25px solid black',
              cursor: 'pointer',
              fontSize: '1em',
              fontFamily: 'Inter',
              fontWeight: 700,
            }}
            variant="contained"
            className="my-elections-button"
            onClick={handleOpenLogin}
          >
            Iniciar sesion
          </Button>
        </>
      ) : (
        <Button
          sx={{
            color: 'var(--background-color)',
            backgroundColor: 'var(--primary-color)',
            height: '80%',
              padding: '0.5% 1%',
              marginRight: '0.5em',
              cursor: 'pointer',
              fontSize: '1em',
              fontFamily: 'Inter',
              marginLeft: 'auto',
              fontWeight: 700,
              border: '0.25px solid black',
          }}
          variant="contained"
          className="my-elections-button"
          onClick={handleClickUser}
        >
          Mis elecciones
        </Button>
      )}
      <Signin openState={openSignin} setOpenState={setOpenSignin} />
      <Login open={openLogin} setOpenState={setOpenLogin} />
    </div>
  );
}

export default Menu;


