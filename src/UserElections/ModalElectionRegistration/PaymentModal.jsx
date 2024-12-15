import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Slider, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {  useNavigate } from 'react-router-dom';
const AmountModal = ({ open, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [persons, setPersons] = useState([0, 10000]);
  const [formulasByParty, setFormulasByParty] = useState([0, 100]);
  const [parties, setParties] = useState([0, 100]);
  const [positions, setPositions] = useState([0, 100]);
  const [votingTables, setVotingTables] = useState([0, 100000]);
  const [cost, setCost] = useState(0.0);
  const [preferenceId, setPreferenceId] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [planLimit, setPlanLimit] = useState({});
 const navigate = useNavigate();
  const handleConfirm = () => {
    onConfirm({
      persons,
      formulasByParty,
      parties,
      positions,
      votingTables,
    });
    onClose();
  };

  const maxValues = {
    persons: 10000,
    formulasByParty: 100,
    parties: 100,
    positions: 100,
    votingTables: 100000,
  };

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/freePlanLimits`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          setPlanLimit(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
      setStep(1); 
    }, []);

  const handleInputChange = (setter, index, otherIndex) => (event) => {
  
    let value = Math.max(0, Math.floor(Number(event.target.value)));
    value = Number(value);
    setter((prev) => {
      const newValues = [...prev];
      if (index === 0 && value > newValues[1]) {
        value = newValues[1];
      } else if (index === 1 && value < newValues[0]) {
        value = newValues[0];
      }
      newValues[index] = value;
      if(newValues[index] === 0){
        newValues[index] = '';
      }
      return newValues;
    });
  };

  const handleFocus = (setter, index) => (event) => {
  
    if (event.target.value === '0') {
      setter((prev) => {
        const newValues = [...prev];
        newValues[index] = '';
        return newValues;
      });
    }
  };

  const handleBlur = (setter, index) => (event) => {
   
    if (event.target.value === '') {
      setter((prev) => {
        const newValues = [...prev];
        newValues[index] = 0;
        return newValues;
      });
    }
  };


  const handleSliderChange = (setter) => (event, newValue) => {
    setter(newValue);
  };

  const handleNextStep = async () => {
    if (step === 2) {
      if(planLimit && (persons[1] <= planLimit.persons && formulasByParty[1] <= planLimit.formulasByParty && parties[1] <= planLimit.parties && positions[1] <= planLimit.positions && votingTables[1] <= planLimit.votingTables)){
        sessionStorage.setItem('paymentDone', 'true');
        sessionStorage.setItem('planLimit', JSON.stringify({
          persons: persons[1],
          formulasByParty: formulasByParty[1],
          parties: parties[1],
          positions: positions[1],
          votingTables: votingTables[1],
        }));
        setStep(step-1); 
        navigate('/userElections');
        onClose();
      }
      else{
      setLoading(true);
      setStep(step + 1);
      await fetchPaymentLink();
      setLoading(false);
      }

    } else {
      setStep(step + 1);
    }

  };


  const fetchPaymentLink = async () => {
    try {
      if (!(step === 3) && persons[1] === 0 && formulasByParty[1] === 0 && parties[1] === 0 && positions[1] === 0 && votingTables[1] === 0) {
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          persons: persons[1],
          formulasByParty: formulasByParty[1],
          parties: parties[1],
          positions: positions[1],
          votingTables: votingTables[1],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCost(data.amount);
      setPreferenceId(data.paymentId);
      setPaymentLink(data.paymentUrl);
      sessionStorage.setItem('planLimit', JSON.stringify({
        persons: persons[1],
        formulasByParty: formulasByParty[1],
        parties: parties[1],
        positions: positions[1],
        votingTables: votingTables[1],
      }));

      try {

        const mp = await loadMercadoPago();
        if (mp) {
          const mercadoPagoInstance = new window.MercadoPago('APP_USR-73f3ae65-28d8-4ebc-b6a8-51fa93d7f4cc', { locale: 'es-AR' });


          mercadoPagoInstance.bricks().create('wallet', 'wallet_container', {
            initialization: {
              preferenceId: data.paymentId,
            },
          });
        }
      } catch (error) {
        console.error('Error initializing MercadoPago:', error);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: step === 2 ? 800 : 700, // Adjust width based on step
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '16px',
        overflow: 'hidden',
        p: 0, // Remove padding from the entire modal
      }}>
        <Box sx={{ bgcolor: '#020246', p: 2 }}>
          <Typography variant="h6" component="h2" color="white">
            {step === 1 ? 'Estableza sus requerimientos' : step === 2 ? 'Confirmar requerimientos' : 'Pago'}
          </Typography>
        </Box>

        <Box sx={{ paddingLeft: 4, paddingBottom: 3, paddingRight: 4, paddingTop: 2 }}> {/* Add padding to the content area */}
          {step === 1 ? (
            <>
              <Grid container spacing={2}>
                {[
                  { name: 'Personas', value: persons, setter: setPersons, max: maxValues.persons },
                  { name: 'Formulas por partido', value: formulasByParty, setter: setFormulasByParty, max: maxValues.formulasByParty },
                  { name: 'Partidos', value: parties, setter: setParties, max: maxValues.parties },
                  { name: 'Posiciones', value: positions, setter: setPositions, max: maxValues.positions },
                  { name: 'Mesas de votacion', value: votingTables, setter: setVotingTables, max: maxValues.votingTables },
                ].map(({ name, value, setter, max }, index) => (
                  <Grid item xs={12} key={index}> {/* Cada slider ocupa toda la fila */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {/* Título del slider */}
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: '#303030' }}
                      >
                        {name}
                      </Typography>
                      {/* Contenedor del slider y los valores min/max */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Input Min */}
                        <TextField
                          type="number"
                          value={value[0]}
                          onChange={handleInputChange(setter, 0, 1)}
                          onFocus={handleFocus(setter, 0)}
                          onBlur={handleBlur(setter, 0)}
                          size="small" // Tamaño pequeño
                          sx={{
                            width: '12rem',
                            backgroundColor: 'rgba(20, 20, 20, 0.1)',
                            border: 'none',
                            '& .MuiOutlinedInput-root': {
                              padding: '0rem',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            borderRadius: '5px',
                            boxShadow: '0px 3px 6px rgba(100, 100, 100, 0.2)',
                          }}
                        />
                        <Slider
                          value={value}
                          onChange={handleSliderChange(setter)}
                          
                          valueLabelDisplay="auto"
                          min={0}
                          max={max}
                          sx={{
                            color: 'var(--secondary-color)',
                            width: '700px',
                            marginLeft: '5px',
                            marginRight: '5px',
                            '& .MuiSlider-valueLabel': {
                              backgroundColor: 'rgba(80, 55, 204, 0.65)',
                              borderRadius: '5px'
                            }
                          }}
                        />
                        {/* Input Max */}
                        <TextField
                          type="number"
                          value={value[1]}
                          onChange={handleInputChange(setter, 1, 0)}
                          onFocus={handleFocus(setter, 1)}
                          onBlur={handleBlur(setter, 1)}
                          size="small"
                          sx={{
                            width: '12rem',
                            backgroundColor: 'rgba(20, 20, 20, 0.1)',
                            border: 'none',
                            '& .MuiOutlinedInput-root': {
                              padding: '0rem',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            borderRadius: '5px',
                            boxShadow: '0px 3px 6px rgba(100, 100, 100, 0.2)',
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  sx={{ mt: 1, bgcolor: 'var(--primary-color)', width: '50%' }}
                >
                  Continuar
                </Button>
              </Box>
            </>
          ) : step === 2 ? (
            <>
              <Grid container spacing={2} sx={{ mt: 2, mb: 5 }}>
                <Grid size={6}>
                  <Card elevation={2} sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Máxima cantidad de personas
                      </Typography>
                      <Typography>{persons[1]}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={6}>
                  <Card elevation={2} sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Máxima cantidad de formulas por partido
                      </Typography>
                      <Typography>{formulasByParty[1]}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={6}>
                  <Card elevation={2} sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Máxima cantidad de partidos
                      </Typography>
                      <Typography>{parties[1]}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={6}>
                  <Card elevation={2} sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Máxima cantidad de posiciones
                      </Typography>
                      <Typography>{positions[1]}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={12}>
                  <Card elevation={2} sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Máxima cantidad de mesas de votación
                      </Typography>
                      <Typography>{votingTables[1]}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevStep}
                  sx={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', mr: 2, width: '50%' }}
                >
                  Volver
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  sx={{ bgcolor: 'var(--primary-color)', width: '50%' }}
                >
                  Confirmar
                </Button>
              </Box>
            </>
          ) : (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box sx={{ mt: 2, mb: 5 }}>
                    <Typography variant="h6">Costo Total: ${cost}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handlePrevStep}
                      sx={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', mr: 2, mt: 2, width: '50%', maxHeight: '48px' }}
                    >
                      Volver
                    </Button>
                    <div id="wallet_container" style={{ width: '50%' }}></div>
                  </Box>
                </>
              )}
            </>
          )
          }
        </Box>
      </Box>
    </Modal>
  );
};

export default AmountModal;