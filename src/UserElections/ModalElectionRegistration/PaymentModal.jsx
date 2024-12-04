import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Slider,CircularProgress} from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import Paper from '@mui/material/Paper';
import { loadMercadoPago } from "@mercadopago/sdk-js";

const AmountModal = ({ open, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [persons, setPersons] = useState([0, 10000]);
  const [formulasByParty, setFormulasByParty] = useState([0, 100]);
  const [parties, setParties] = useState([0, 100]);
  const [positions, setPositions] = useState([0, 100]);
  const [votingTables, setVotingTables] = useState([0, 100000]);
  const [cost, setCost] = useState(0.0);
  const [preferenceId, setPreferenceId] = useState("");
  const [paymentLink,setPaymentLink ] = useState("");
  const [loading, setLoading] = useState(false);

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
      return newValues;
    });
  };

  const handleSliderChange = (setter) => (event, newValue) => {
    setter(newValue);
  };

  const handleNextStep = async () => {
    if (step === 2) {
        setLoading(true);
        setStep(step + 1);
        await fetchPaymentLink();
        setLoading(false);
     
    }else{
         setStep(step + 1);
    }
   
  };

  
  const fetchPaymentLink = async () => {
    try {
        if ( !(step === 3) && persons[1] === 0 && formulasByParty[1] === 0 && parties[1] === 0 && positions[1] === 0 && votingTables[1] === 0) {
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        
        console.log(data);
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
        width: step === 2 ? 900 : 700, // Adjust width based on step
        bgcolor: 'background.paper', 
        boxShadow: 24, 
        p: 0 // Remove padding from the entire modal
      }}>
        <Box sx={{ bgcolor: '#020246', p: 2 }}>
          <Typography variant="h6" component="h2" color="white">
            {step === 1 ? 'Estableza sus requerimientos' : step === 2 ? 'Confirmar requerimientos' : 'Pago'}
          </Typography>
        </Box>
       
        <Box sx={{ paddingLeft: 4, paddingBottom: 4, paddingRight: 4, paddingTop: 2 }}> {/* Add padding to the content area */}
          {step === 1 ? (
            <>
              <Grid container spacing={4}>
                {[
                  { name:'Personas' ,label: 'Persons', value: persons, setter: setPersons,max: maxValues.persons },
                  { name:'Formulas por partido',label: 'Formulas By Party', value: formulasByParty, setter: setFormulasByParty, max: maxValues.formulasByParty },
                  { name:'Partidos',label: 'Parties', value: parties, setter: setParties, max: maxValues.parties },
                  { name:'Posiciones',label: 'Positions', value: positions, setter: setPositions, max: maxValues.positions },
                  { name:'Mesas de votacion',label: 'Voting Tables', value: votingTables, setter: setVotingTables, max: maxValues.votingTables },
                ].map(({name, value, setter,max }, index) => (
                  <Grid  size= {index === 4? 12:6} key={index} sx={{paddingRight:3}}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#303030',mb:5 }}>
                      {name}
                    </Typography>
                    <Slider
                      value={value}
                      onChange={handleSliderChange(setter)}
                      valueLabelDisplay="on"
                      min={0}
                      max={max}
                      sx={{ color: 'var(--secondary-color)', 
                        '& .MuiSlider-valueLabel': {
                        backgroundColor: 'var(--primary-color)',
                    }}}
                      
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ width: '45%', mr: 1 }}>
                        <TextField
                          label="Min"
                          type="number"
                          value={value[0]}
                          onChange={handleInputChange(setter, 0, 1)}
                          fullWidth
                        />
                      </Box>
                      <Box sx={{ width: '45%', ml: 1 }}>
                        <TextField
                          label="Max"
                          type="number"
                          value={value[1]}
                          onChange={handleInputChange(setter, 1, 0)}      
                          fullWidth
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
                sx={{ mt: 4, bgcolor: 'var(--primary-color)',width: '50%' }} 
              >
                Continuar
              </Button>
            </Box>
            </>
          ) : step === 2? (
            <>
             <Grid container spacing={2} sx={{ mt: 2,mb:5 }}>
                <Grid  size={6}>
                  <Paper elevation={3} sx={{ p: 2,display: 'flex', justifyContent: 'center' }}>
                    <Typography>Maxima cantidad de personas: {persons[1]}</Typography>
                  </Paper>
                </Grid>
                <Grid  size={6}>
                  <Paper elevation={3} sx={{ p: 2,display: 'flex', justifyContent: 'center' }}>
                    <Typography>Maxima cantidad de formulas por partido: {formulasByParty[1]}</Typography>
                  </Paper>
                </Grid>
                <Grid  size={6}>
                  <Paper elevation={3} sx={{ p: 2,display: 'flex', justifyContent: 'center' }}>
                    <Typography>Maxima cantidad de partidos: {parties[1]}</Typography>
                  </Paper>
                </Grid>
                <Grid  size={6}>
                  <Paper elevation={3} sx={{ p: 2,display: 'flex', justifyContent: 'center' }}>
                    <Typography>Maxima cantidad de posiciones: {positions[1]}</Typography>
                  </Paper>
                </Grid>
                <Grid  size={12}>
                  <Paper elevation={3} sx={{ p: 2,display: 'flex', justifyContent: 'center' }}>
                    <Typography>Maxima cantidad de mesas de votacion: {votingTables[1]}</Typography>
                  </Paper>
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
                  sx={{ bgcolor: 'var(--primary-color)',width: '50%' }}
                >
                  Confirmar
                </Button>
              </Box>
            </>
          ):(
            <>
             {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
              <Box sx={{ mt: 2,mb:5 }}>
                <Typography variant="h6">Costo Total: ${cost}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevStep}
                  sx={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', mr: 2,mt:2, width: '50%',maxHeight: '48px' }}
                >
                  Volver
                </Button>
                <div id="wallet_container" style={{ width: '50%'}}></div>
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