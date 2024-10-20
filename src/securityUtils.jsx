export const detectCodeInjection = (input) => {
    const dangerousPatterns = [
        /<script.*?>.*?<\/script>/gi,  // Detecta scripts HTML
        /SELECT.*FROM.*WHERE/gi,       // Detecta consultas SQL básicas
        /INSERT.*INTO.*VALUES/gi,      // Detecta consultas SQL de inserción
        /DELETE.*FROM/gi,              // Detecta consultas SQL de eliminación
        /UPDATE.*SET/gi,               // Detecta consultas SQL de actualización
        /javascript:/gi,               // Detecta URLs con javascript
        /on\w+=["'].*["']/gi,          // Detecta eventos inline como onclick, onmouseover, etc.
    ];
    return dangerousPatterns.some(pattern => pattern.test(input));
};
