import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
    let sanitizedInput = DOMPurify.sanitize(input);
    return sanitizedInput.replace(/&/g, "")
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .replace(/\//g, "")
    .replace(/\\/g, "")   
    .replace(/=/g, "")   
    .replace(/;/g, "")    
    .replace(/:/g, "")   
    .replace(/\(/g, "")    
    .replace(/\)/g, "")    
    .replace(/{/g, "")   
    .replace(/}/g, "")  
    .replace(/\[/g, "")  
    .replace(/\]/g, "") 
    .replace(/%/g, "");   
};
export default sanitizeInput;