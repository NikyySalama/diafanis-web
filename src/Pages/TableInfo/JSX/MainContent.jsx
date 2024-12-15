import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/MainContentTable.css';
import { Box, Typography, Button, Snackbar, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InputField from '../../../Common/InputField';
import Carousel from 'react-material-ui-carousel';
import forge from 'node-forge';
import ItemFormulaResult from '../../Election/JSX/ItemFormulaResult';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const TextContainer = ({ title, content, icon }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const copyToClipboard = async (content) => {
    if (content == null) return;
    try {
      await navigator.clipboard.writeText(content);
      setSnackbarMessage('Copiado al portapapeles');
    } catch (err) {
      setSnackbarMessage('Error');
    }
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{backgroundColor:'#fff', padding: '0.75em', margin: '1em', border: '1px solid #ddd', borderRadius: '16px' }}>
      <Grid container alignItems="center">
        <Grid>
          <Typography
            variant="h6"
            sx={{
              color: 'var(--primary-color)',
              fontSize: '1.2em',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              
            }}
          >
            {title}
          </Typography>
        </Grid>
        {icon && (
          <Grid>
            <Button
              variant="text"
              onClick={() => copyToClipboard(content)}
              startIcon={<ContentCopyIcon sx={{ color: 'grey' }} />}
            />
          </Grid>
        )}
      </Grid>
      <Divider aria-hidden="true" sx={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black', opacity: 0.2 }}/>
    <Typography
      variant="body1"
      sx={{
        color: 'var(--primary-color)',
        overflowY: 'auto',
        maxHeight: '4em',
        paddingTop: '0.5em',
        wordWrap: 'break-word',
        margin: 0,
      }}
    >
      {content}
    </Typography>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
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

  return (
    <Box sx={{ padding: '0.75em', margin: '1em', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', borderRadius: '16px', background: 'var(--background-color)', flexGrow: 1 }}>
      <Carousel
        navButtonsAlwaysVisible
        indicators={true}
        animation="slide"
        autoPlay={false}
        cycleNavigation={false}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        {positions && Object.entries(positions).map(([positionId, position], index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '40em', width: '100%' }}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              {position.title || 'Unknown Position'}
            </Typography>
            <Box sx={{ overflowY: 'auto', padding: '1em', display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%' }}>
              {display && table.results && table.results[positionId] ? (
                Object.entries(table.results[positionId]).map(([formulaId, votes]) => (
                  <ItemFormulaResult
                    key={formulaId}
                    votes={votes}
                    imgUrl={forms[formulaId]?.party?.logoUrl}
                  />
                ))
              ) : (
                <Typography variant="body1">La elección aun no ha terminado</Typography>
              )}
            </Box>
          </Box>
        ))}
      </Carousel>
      {display && table.results && (
        <Button
          sx={{
            color: 'var(--background-color)',
            backgroundColor: 'var(--primary-color)',
            height: '3em',
            padding: '0.5em 1em',
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
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};


const MainContent = () => {
  const navigate = useNavigate();
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
    const savedElection = sessionStorage.getItem('election');
    const election = savedElection ? JSON.parse(savedElection) : null;

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
      setSnackbarMessage("Clave publica o Firma erronea");
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

    str = str.replace(/["' ]/g, '');

    // Remove only the initial space at the start
    str = str.trimStart();
    str = str.toString();
    console.log(str);
    const isVerified = await verifyHash(formattedPublicKey, str, signature);

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

  return (
    <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 3, md: 4 }} columns={16} sx={{ height: '100%' }}>
      <Grid size={16} sx={{ display: 'flex', flexDirection: 'row', height: '50%' }}>
        <Grid size={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Grid>
            <TextContainer title="Ubicación" content={`${table.location.country}, ${table.location.state}, ${table.location.city}, ${table.location.address}`} />
          </Grid>
          <Grid>
            <TextContainer title="Clave pública" content={publicKey} icon={true} />
          </Grid>
          <Grid>
            <TextContainer title="Firma" content={hash} icon={true} />
          </Grid>
       
         <Grid size={8} sx={{paddingLeft:'1em', display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid size={8}>
              <InputField
                label='Clave Publica'
                placeholder="Clave publica"
                onChangeMethod={handleInputChange}
                values={formValues}
                name='Clave Publica'
                disabled={false}
              />
            </Grid>
            <Grid size={8}>
              <InputField
                label="Firma"
                placeholder="Firma"
                onChangeMethod={handleInputChange}
                values={formValues['Firma']}
                name="Firma"
                disabled={false}
              />
            </Grid>
            <Grid size={8}>
              <InputField
                label="Resultados"
                placeholder="Resultados"
                onChangeMethod={handleInputChange}
                values={formValues['Resultados']}
                name="Resultados"
                disabled={false}
              />
            </Grid>
            <Grid size={8}>
              <Button
                sx={{
                  color: 'var(--background-color)',
                  backgroundColor: 'var(--primary-color)',
                  height: '3em',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  border: '0.25px solid black',
                }}
                variant="contained"
                onClick={handleVerification}
                disabled={!positions || !table || !forms || !formValues['Clave Publica'] || !formValues['Firma'] || !formValues['Resultados']}
              >
                Validar acta
              </Button>
            </Grid>
          </Grid>
         
        </Grid>
      </Grid>
      <Grid sx={{  display: 'flex',flexGrow: 1, }}>
            <CarouselComponent table={table} positions={positions} forms={forms} display={display} />
          </Grid>
</Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Grid>
  );
};

export default MainContent;