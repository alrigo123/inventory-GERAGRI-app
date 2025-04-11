import axios from 'axios';
import * as XLSX from "xlsx";

const API_export = process.env.REACT_APP_API_URL_EXPORT;

const ExportReportsSituaMod = () => {
  const fechaFormateada = new Date().toISOString().split("T")[0];

  // Función genérica para consultar API
  const fetchData = async (url, formatCallbacks = {}) => {
    try {
      const response = await axios.get(url);
      const processedData = response.data.map((item) => {
        let formattedItem = { ...item };
        for (const key in formatCallbacks) {
          if (Object.hasOwnProperty.call(formatCallbacks, key)) {
            formattedItem[key] = formatCallbacks[key](item[key]);
          }
        }
        return formattedItem;
      });
      return processedData; // Devuelve los datos procesados
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return [];
    }
  };

  // Función para formatear fechas
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("es-ES");
  };

  // Función para mapear estado
  const mapEstado = (estado) => {
    if (estado === 1) return "Verificado";
    if (estado === 0) return "Faltante";
    return "Desconocido";
  };

  // Función genérica para exportar datos a Excel
  const exportToExcel = (dataToExport, fileName) => {
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `${fileName}-${fechaFormateada}.xlsx`);
  };

  // Configuración de consultas
  const queriesConfig = [
    {
      name: "REPORTE VERIFICADOS",
      url: `${API_export}/situation/true`,
      formatCallbacks: {
        FECHA_REGISTRO: formatDate,
        SITUACION: mapEstado,
      },
      fileName: "reporte-verificados",
    },
    {
      name: "REPORTE FALTANTES",
      url: `${API_export}/situation/false`,
      formatCallbacks: {
        FECHA_REGISTRO: formatDate,
        SITUACION: mapEstado,
      },
      fileName: "reporte-faltantes",
    },
    {
      name: "REPORTE CONSOLIDADO SITUACIÓN",
      url: `${API_export}/situation`,
      formatCallbacks: {
        FECHA_REGISTRO: formatDate,
        SITUACION: mapEstado,
      },
      fileName: "reporte-situacion-consolidado",
    },
  ];

  // Manejo de exportación dinámica
  const handleExport = async (config) => {
    try {
      // Fetch data directamente desde la API
      const fetchedData = await fetchData(config.url, config.formatCallbacks);
      // Exportar usando los datos devueltos
      exportToExcel(fetchedData, config.fileName);
    } catch (error) {
      console.error(`Error al exportar ${config.name}:`, error);
    }
  };

  // Renderizado de botones
  return (
    <div className="row mt-2 mb-2">
      {queriesConfig.map((config, index) => (
        <div className="col-4" key={index}>
          <button
            className="btn btn-success btn-sm fw-bolder w-100 py-2"
            onClick={() => handleExport(config)}
          >
            {config.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExportReportsSituaMod;
