import React from 'react';
import '../CSS/MainContentTable.css';
import { useState, useEffect } from 'react';
import { Carousel } from '@mantine/carousel';
import { Box, MantineProvider } from '@mantine/core';
import { Typography } from '@mui/material';
import ItemFormulaResult from '../../Election/JSX/ItemFormulaResult';
import '@mantine/carousel/styles.css';
import Grid from '@mui/material/Grid2';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import InputField from '../../../Common/InputField';

import forge from 'node-forge';
import { tab } from '@testing-library/user-event/dist/tab';
const TextContainer = ({ title, content, icon }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setSnackbarMessage('Copiado al portapapeles');
    } catch (err) {
      setSnackbarMessage('Error');
    }
    setSnackbarOpen(true);
  };

  return (
    <div className='text-container'>
      <Grid container rowSpacing={1} columnSpacing={0} columns={18} alignItems="center">
        <Grid >
          <Typography
            variant="h6"
            sx={{
              color: 'var(--primary-color)',
              fontSize: '1.2em',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: '0.5em',
              margin: 0,
              width: 'fit-content'
            }}
          >
            {title}
          </Typography>
        </Grid>
        {icon && (
          <Grid >
            <Button
              variant="text"
              onClick={() => copyToClipboard(content)}
              startIcon={<ContentCopyIcon sx={{ color: 'grey', padding: '0' }} />}
            />
          </Grid>
        )}
      </Grid>
      <Divider aria-hidden="true" sx={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black', opacity: 0.2 }} />
      <Typography variant="body1" sx={{ color: 'var(--primary-color)' }} className='output-field'>
        {content}
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};


const CarouselComponent = ({ table, positions, forms, display }) => {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setSnackbarMessage('Copiado al portapapeles');
    } catch (err) {
      setSnackbarMessage('Error');
    }
    setSnackbarOpen(true);
  };

  return(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Carousel  slideSize="100%" slideGap="md" align="start" withControls withIndicators>
      {table.results && Object.entries(table.results).map(([positionId, formulas], index) => (
        <Carousel.Slide key={index} className="carouselSlide">
          <>
            <Typography sx={{marginLeft:'11em'}} variant="h5" className="slideTitulo">
              {positions[positionId]?.title || 'Unknown Position'}
            </Typography>
            {display ? (
              Object.entries(formulas).map(([formulaId, votes]) => (
                <ItemFormulaResult
                  key={formulaId}
                  votes={votes}
                  imgUrl={forms[formulaId]?.party?.logoUrl}
                />
              ))
            ) : (
              <Typography variant="body1">La elección aun no ha terminado</Typography>
            )}
          </>
        </Carousel.Slide>
      ))}
    </Carousel>
    <Button
            sx={{
              color: 'var(--background-color)',
              backgroundColor: 'var(--primary-color)',
              height: '3em',
              padding: '0.5em 1em',
              marginLeft: '17em',
              marginTop: '1em',
              cursor: 'pointer',
              fontSize: '1em',
              fontFamily: 'Inter',
              fontWeight: 700,
              border: '0.25px solid black',
            }}
            variant="contained"
            onClick={() => copyToClipboard(JSON.stringify(table.results))}
          >
            Copiar resultados
          </Button>
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
  </MantineProvider>
  );
};

const MainContent = () => {
  const [positions, setPositions] = useState(null);
  const [table, setTable] = useState(null);
  const [forms, setForms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [display, setDisplay] = useState(null);
  const [formValues, setFormValues] = useState({
    'Clave Publica': '',
    'Firma': '',
    'Resultados': '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {

    const storedPositions = sessionStorage.getItem('positions');
    const storedTable = sessionStorage.getItem('tableInfo');
    const storedForms = sessionStorage.getItem('formulas');
    const storedDisplay = sessionStorage.getItem('display');

    setPositions(storedPositions ? JSON.parse(storedPositions) : null);
    setTable(storedTable ? JSON.parse(storedTable) : null);
    setForms(storedForms ? JSON.parse(storedForms) : null);
    setDisplay(storedDisplay ? JSON.parse(storedDisplay) : false);

    setLoading(false);


    if (!storedPositions) {
      console.warn('Positions data is missing.');
    }
    if (!storedTable) {
      console.warn('Table data is missing.');
    }
    if (!storedForms) {
      console.warn('Forms data is missing.');
    }
  }, []);

  useEffect(() => {
    if (table && table?.publicKey && table?.hashedResults) {
      const key = table.publicKey
        .replace(/-----BEGIN RSA PUBLIC KEY-----\n?/, '') // Remove the "BEGIN" line
        .replace(/-----END RSA PUBLIC KEY-----\n?/, '')   // Remove the "END" line
        .replace(/\n/g, '');  // Remove any newline characters inside the key
      const hash = table.hashedResults;
      setHash(hash);
      setPublicKey(key);
    }
  }, [table]);






  async function verifyHash(publicKeyPem, dataObject, signatureBase64) {
      try {
          // Convert the public key PEM to a forge public key
          const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
          
          // Step 1: Stringify the object
          const dataString = dataObject;
          console.log('Data String:', dataString);
          
          // Step 2: Create a SHA-256 message digest of the stringified data
          const md = forge.md.sha256.create();
          md.update(dataString, 'utf8');
  
          // Step 3: Decode the Base64 signature
          const signature = forge.util.decode64(signatureBase64);
          
          // Step 4: Verify the signature
          const isVerified = publicKey.verify(md.digest().getBytes(), signature);
          
          console.log('Signature verified:', isVerified);
          return isVerified;
      } catch (error) {
          console.error('Verification failed:', error);
          setSnackbarMessage("Clave publica o Firma erronea")
      }
  }
  const formatObject = (obj) => {
    return Object.entries(obj)
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return `${key}: ${formatObject(value)}`; // Recursively format nested objects
        }
        return `${key}: ${value}`;
      })
      .join(', ');
  };
  
  function formatPublicKey(key) {
    const header = "-----BEGIN PUBLIC KEY-----";
    const footer = "-----END PUBLIC KEY-----";
    
    // Insert newlines every 64 characters for proper PEM formatting
    const keyWithNewlines = key.match(/.{1,64}/g).join('\n');
    
    return `${header}\n${keyWithNewlines}\n${footer}`;
  }
  
  // Usage in handleVerification
  const handleVerification = async () => {
    const { 'Clave Publica': publicKeyInput, 'Firma': signature, 'Resultados': message } = formValues;
  
    // Prepare the JSON object for conversion

    // Convert the object to a string  
    // Format the public key and then proceed with verification
    const formattedPublicKey = formatPublicKey(publicKeyInput); // Format input for public key

   // console.log("hikj",modifiedString);
    let str = message;

// Use regular expression to remove the quotes around the keys
str = str.replace(/"([^"]+)":/g, '$1:');

// Remove only the initial space at the start
str = str.trimStart();
str = str.toString();
str = str.replace(/:/g, ': ');
    console.log(str);
    const isVerified = await verifyHash(formattedPublicKey,str
    , signature);
    
    console.log('Verification result:', isVerified);
    
    if (isVerified) {
        setSnackbarMessage("El acta está inalterada");
    } else {
        setSnackbarMessage("El acta está alterada");
    }
    setSnackbarOpen(true);
};



 



  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (!positions || !table || !forms) {
    return <Typography>Hubo un error al cargar la mesa,por favor vuelva a la pagina anterior e intente de vuelta.</Typography>;
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={16}>
        <Grid size={9}>
          <div className='info-container'>
            <TextContainer title="Firma" content={hash} icon={true} />
            <TextContainer title="Clave publica" content={publicKey} icon={true} />
          </div>
        </Grid>
        <Grid size={7}>
          <CarouselComponent table={table} positions={positions} forms={forms} display={display} />
        </Grid>

        <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Grid size={20} sx={{ padding: '0.5em' }}>
            <InputField
              label='Clave Publica'
              placeholder="Clave publica"
              onChangeMethod={handleInputChange}
              values={formValues}
              name='Clave Publica'
            />

          </Grid>
          <Grid size={20} sx={{ padding: '0.5em' }}>
            <InputField
              label="Firma"
              placeholder="Firma"
              onChangeMethod={handleInputChange}
              values={formValues['Firma']}
              name="Firma"
            />
          </Grid>
          <Grid size={20} sx={{ padding: '0.5em' }}>
            <InputField
              label="Resultados"
              placeholder="Resultados"
              onChangeMethod={handleInputChange}
              values={formValues['Resultados']}
              name="Resultados"
            />
          </Grid>
          <Button
            sx={{
              color: 'var(--background-color)',
              backgroundColor: 'var(--primary-color)',
              height: '3em',
              padding: '0.5em 1em',
              marginLeft: '1em',
              cursor: 'pointer',
              fontSize: '1em',
              fontFamily: 'Inter',
              fontWeight: 700,
              border: '0.25px solid black',
            }}
            variant="contained"
            onClick={handleVerification}
          >
            Validar acta
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

      </Grid>
    </MantineProvider>
  );
};

export default MainContent;
