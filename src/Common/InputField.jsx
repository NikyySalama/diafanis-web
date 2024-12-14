import { FormControl, FormHelperText, InputAdornment, Modal, Box, IconButton, Button, Input, InputLabel, Popover, Typography, List, ListItem } from '@mui/material';

const InputField = ({ label, placeholder, onChangeMethod, onBlurMethod, values, error, helperText, required,disabled }) => {
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
          disabled={disabled}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  };
  export default InputField