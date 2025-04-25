// Convierte una fecha en formato "DD/MM/YYYY HH:mm:ss" a "YYYY-MM-DD" para inputs tipo date
export const formatToDateInput = (dateString) => {
    if (!dateString) return ''; // Si no hay fecha, retorna cadena vacía

    const parts = dateString.split('/'); // Separa por "/" → [DD, MM, "YYYY HH:mm:ss"]
    if (parts.length !== 3) return ''; // Si no hay 3 partes, el formato es inválido

    const [day, month, yearAndTime] = parts; // Desestructura las partes
    const [year] = yearAndTime.split(' '); // Extrae solo el año, ignora la hora

    // Asegura que el día y el mes tengan 2 dígitos (por ejemplo, "1" → "01")
    const dayPadded = day.padStart(2, '0');
    const monthPadded = month.padStart(2, '0');

    // Retorna la fecha en formato "YYYY-MM-DD" (compatible con inputs HTML tipo date)
    return `${year}-${monthPadded}-${dayPadded}`;
};

// Convierte una fecha en formato "YYYY-MM-DD" a "DD/MM/YYYY HH:mm:ss", para guardar en DB
export const formatToDatabase = (dateString) => {
    if (!dateString || dateString.trim() === '') return ''; // Si está vacía, retorna cadena vacía

    const [year, month, day] = dateString.split('-'); // Separa la fecha en sus partes

    if (!year || !month || !day) return ''; // Verifica que los 3 valores existan

    // Retorna en formato "DD/MM/YYYY 00:00:00"
    return `${day}/${month}/${year} 00:00:00`;
};

// Convierte una fecha en string a formato legible "DD/MM/YYYY HH:mm:ss"
export const parseDate = (dateString) => {
    if (!dateString) return 'SIN REGISTRO'; // Si no hay fecha, retorna vacío

    // Usa el constructor Date y lo convierte a una cadena en español con formato completo
    const dateParsed = new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return dateParsed;
};
