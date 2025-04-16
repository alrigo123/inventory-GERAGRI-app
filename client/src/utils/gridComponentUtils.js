// Importa la librería XLSX para manipular archivos Excel
import * as XLSX from 'xlsx';

// Define las columnas esperadas en los archivos Excel
const expectedColumns = ['CODIGO_PATRIMONIAL', 'DESCRIPCION', 'TRABAJADOR', 'DEPENDENCIA', 'UBICACION', 'FECHA_COMPRA', 'FECHA_ALTA'];

/**
 * Función que formatea un valor de fecha para su almacenamiento en la base de datos.
 * Si el valor es un objeto de tipo Date, lo convierte al formato dd/mm/yyyy.
 * Si no es una fecha, lo devuelve tal como está.
 */
export const formatDateForDB = (value) => {
  if (value instanceof Date) {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return value;
};

/**
 * Función que procesa todas las hojas de un archivo Excel.
 * Aplica las validaciones correspondientes: encabezados, códigos patrimoniales y fechas.
 * Devuelve un objeto con los datos por hoja y un indicador de si el archivo es válido.
 */
export const processSheets = (
  workbook,
  validateHeaderColumns,
  validatePatrimonialCodes,
  validateDateColumns,
  setErrorMessage,
  setShowModalButton
) => {
  const sheets = {}; // Objeto para almacenar los datos de cada hoja
  let isValid = true; // Bandera que indica si todas las hojas pasaron las validaciones

  // Itera sobre cada hoja del archivo Excel
  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convierte la hoja a un array de arrays (incluye encabezados)

    // Aplica las validaciones. Si alguna falla, se detiene y marca el archivo como inválido.
    if (
      !validateHeaderColumns(sheetData, expectedColumns, setErrorMessage, setShowModalButton) ||
      !validatePatrimonialCodes(sheetData, setErrorMessage, setShowModalButton) ||
      !validateDateColumns(sheetData, setErrorMessage, setShowModalButton)
    ) {
      isValid = false;
      return;
    }

    // Si todas las validaciones pasan, guarda la hoja en el objeto "sheets"
    sheets[sheetName] = sheetData;
  });

  return { sheets, isValid };
};

/**
 * Función para actualizar los estados principales tras haber procesado un archivo Excel correctamente.
 * Establece la primera hoja como activa, actualiza la barra de progreso y muestra la carga.
 */
export const updateStateAndProgress = (
  sheets,
  workbook,
  setSheetsData,
  setCurrentSheet,
  setProgress,
  setFileLoaded,
  setLoading
) => {
  setSheetsData(sheets); // Guarda los datos procesados
  setCurrentSheet(workbook.SheetNames[0]); // Establece como activa la primera hoja del archivo
  setProgress(100); // Marca progreso como 100%
  setFileLoaded(true); // Marca el archivo como cargado

  // Después de un breve intervalo, restablece los indicadores de carga
  setTimeout(() => {
    setFileLoaded(false);
    setLoading(false);
  }, 1100);
};

/**
 * Función para actualizar el valor de una celda específica dentro de una hoja.
 * Usa setState para actualizar de forma inmutable solo la celda deseada.
 */
export const updateCellValue = (setSheetsData, sheetName, rowIndex, colIndex, newValue) => {
  setSheetsData((prevData) => {
    if (!prevData[sheetName]) return prevData; // Verifica que la hoja exista

    // Retorna un nuevo objeto con los datos modificados solo en la celda indicada
    return {
      ...prevData,
      [sheetName]: prevData[sheetName].map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) => (cIdx === colIndex ? newValue : cell))
          : row
      ),
    };
  });
};
