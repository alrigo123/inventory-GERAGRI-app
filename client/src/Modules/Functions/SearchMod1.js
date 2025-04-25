import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PopNotify from '../../AnimationComp/PopNotify';
import { parseDate } from '../../utils/datesUtils';
import { exportarItems } from '../../utils/exportReportBySearch';
import { Modal, Button } from 'react-bootstrap'; // Usamos react-bootstrap para el modal.

const URL = process.env.REACT_APP_API_URL_ITEMS;

const SearchMod1 = ({ searchUrl, title, exportFileName }) => {
    const [searchTerm1, setSearchTerm1] = useState('');
    const [results1, setResults1] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newObservation, setNewObservation] = useState('');
    const debounceTimeout = useRef(null);

    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const [filterEstado, setFilterEstado] = useState('all');
    const [filterDisposicion, setFilterDisposicion] = useState('all');
    const [filterConservation, setfilterConservation] = useState('all');

    const fechaFormateada = new Date().toISOString().split("T")[0];

    const handleInputChange1 = (e) => setSearchTerm1(e.target.value);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (searchTerm1 !== '') {
                const fetchItems1 = async () => {
                    setIsLoading(true);
                    try {
                        const token = localStorage.getItem('token');
                        const response = await axios.get(`${URL}/${searchUrl}?q=${searchTerm1}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        setResults1(response.data);
                    } catch (error) {
                        console.log('Error al obtener los items:', error);
                        setResults1([]);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchItems1();
            } else {
                setResults1([]);
            }
        }, 700);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [searchTerm1, searchUrl]);
    // Ensure that the `searchUrl` dependency is included in the useEffect dependency array.
    // This ensures that the effect re-runs whenever `searchUrl` changes.
    const exportPatrimonizado = () =>
        exportarItems(results1, 1, title, "Bienes_Registrados", searchTerm1, fechaFormateada);

    const exportNoPatrimonizado = () =>
        exportarItems(results1, 0, title, "Bienes_No_Registrados", searchTerm1, fechaFormateada);

    const exportConsolidado = () =>
        exportarItems(results1, undefined, title, "Bienes_Consolidado", searchTerm1, fechaFormateada);

    const handleEditObservation = (item) => {
        setSelectedItem(item);
        setNewObservation(item.OBSERVACION || '');
        setModalVisible(true);
    };

    const saveObservation = async () => {
        try {
            await axios.put(`${URL}/observation/${selectedItem.CODIGO_PATRIMONIAL}`, {
                observacion: newObservation,
            });
            setResults1((prev) =>
                prev.map((item) =>
                    item.CODIGO_PATRIMONIAL === selectedItem.CODIGO_PATRIMONIAL
                        ? { ...item, OBSERVACION: newObservation }
                        : item
                )
            );
            setModalVisible(false);
        } catch (error) {
            console.error('Error al guardar la observación:', error);
        }
    };

    const filteredItems = results1.filter((item) => {
        const estadoFilter =
            filterEstado === 'all' ||
            (filterEstado === 'registered' && item.ESTADO === 1) ||
            (filterEstado === 'not_registered' && item.ESTADO === 0);

        const disposicionFilter =
            filterDisposicion === 'all' ||
            (filterDisposicion === 'available' && item.DISPOSICION === 1) ||
            (filterDisposicion === 'not_available' && item.DISPOSICION === 0);

        const conservationFilter =
            filterConservation === 'all' ||
            (filterConservation === 'good' && item.CONSERV === 1) ||
            (filterConservation === 'bad' && item.CONSERV === 2) ||
            (filterConservation === 'regular' && item.CONSERV === 3) ||
            (filterConservation === 'inha' && item.CONSERV === 4);

        return estadoFilter && disposicionFilter && conservationFilter;
    });

    const handleSort = (column) => {
        let newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newOrder);

        const sortedData = [...results1].sort((a, b) => {
            let valA = a[column] ?? '';
            let valB = b[column] ?? '';
            if (!isNaN(valA) && !isNaN(valB)) {
                return newOrder === 'asc' ? valA - valB : valB - valA;
            }
            return newOrder === 'asc'
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });

        setResults1(sortedData);
    };

    return (
        <div>
            {/* Primer buscador */}
            {/* <h5 className='text-lg-start fw-bold'>BIENES DEL {searchUrl.toUpperCase()}</h5> */}

            <h5 className='text-lg-start fw-bold'>
                BIENES {
                    searchUrl.toUpperCase() === 'WORKER' ? 'DEL TRABAJADOR' :
                        searchUrl.toUpperCase() === 'DEPENDENCY' ? 'DE LA DEPENDENCIA' :
                            '.......'
                }
            </h5>

            <input
                type="text"
                // placeholder={`Ingrese datos de ${searchUrl}`}
                placeholder={
                    `Ingrese ${searchUrl === 'worker' ? 'datos del trabajador (Apellidos y/o Nombres)' :
                        searchUrl === 'dependency' ? 'la dependencia' :
                            searchUrl
                    }`
                }
                value={searchTerm1}
                onChange={handleInputChange1}
                className="form-control mb-3 fw-bold"
                style={{ marginBottom: '20px', padding: '10px', border: "1px solid black" }}
            />

            {/* Muestra un spinner de carga cuando se está realizando la búsqueda */}
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Buscando...</span>
                    </div>
                </div>
            ) : results1.length > 0 ? (
                <div>
                    {/* <h3 className='fw-semibold'>BIENES EN PODER DE <strong>{searchTerm1.toUpperCase()}</strong></h3> */}

                    <h3 className='fw-semibold'>
                        BIENES EN PODER {
                            searchUrl.toUpperCase() === 'WORKER'
                                ? <>DEL TRABAJADOR <strong>{searchTerm1.toUpperCase()}</strong></>
                                : searchUrl.toUpperCase() === 'DEPENDENCY'
                                    ? <>DE LA DEPENDENCIA <strong>{searchTerm1.toUpperCase()}</strong></>
                                    : '.......'
                        }
                    </h3>

                    <div className="row mt-2 g-2">
                        {/* Botón para exportar Patrimonizado */}
                        <div className="col-12 col-md-4">
                            <button
                                className="fw-bold p-2 btn btn-success w-100"
                                onClick={exportPatrimonizado}
                            >
                                Exportar Bienes Registrados
                            </button>
                        </div>
                        {/* Botón para exportar No Patrimonizado */}
                        <div className="col-12 col-md-4">
                            <button
                                className="fw-bold p-2 btn btn-success w-100"
                                onClick={exportNoPatrimonizado}
                            >
                                Exportar Bienes No Registrados
                            </button>
                        </div>
                        {/* Botón para exportar todos los items (Consolidado) */}
                        <div className="col-12 col-md-4">
                            <button
                                className="fw-bold p-2 btn btn-success w-100"
                                onClick={exportConsolidado}
                            >
                                Exportar Consolidado
                            </button>
                        </div>
                    </div>
                    {/* Controles para seleccionar los filtros */}
                    <div className="row mt-2">
                        <h4 className='fw-bold mt-4'>FILTRADO</h4>
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h6 className='fw-semibold mt-2'>por Estado</h6>
                            <select
                                id="filter1"
                                className="form-select fw-bolder"
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="registered">Registrado</option>
                                <option value="not_registered">No Registrado</option>
                            </select>
                        </div>
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h6 className='fw-semibold mt-2 '>por Disposición</h6>
                            <select
                                id="filter2"
                                className="form-select fw-bolder"
                                value={filterDisposicion}
                                onChange={(e) => setFilterDisposicion(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="available">Activo</option>
                                <option value="not_available">de Baja</option>
                            </select>
                        </div>
                        <div className="mb-3 col-12 col-sm-6 col-md-4 text-start">
                            <h6 className='fw-semibold mt-2 '>por Conservación</h6>
                            <select
                                id="filter4"
                                className="form-select fw-bolder"
                                value={filterConservation}
                                onChange={(e) => setfilterConservation(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="good">Bueno</option>
                                <option value="regular">Regular</option>
                                <option value="bad">Malo</option>
                                <option value="inha">INHABILITADO</option>
                            </select>
                        </div>
                    </div>
                    {/* Renderiza la tabla de resultados filtrados */}
                    <div className="table-responsive mt-3">
                        {/* <table className="w-auto table table-striped table-bordered align-middle mt-3"> */}
                        <PopNotify />
                        <table className="table table-striped table-bordered align-middle small">
                            <thead className="table-dark">
                                <tr>
                                    <th onClick={() => handleSort('CODIGO_PATRIMONIAL')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Código Patrimonial {sortColumn === 'CODIGO_PATRIMONIAL' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('DESCRIPCION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Descripción del bien {sortColumn === 'DESCRIPCION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('TRABAJADOR')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Trabajador {sortColumn === 'TRABAJADOR' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('DEPENDENCIA')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Dependencia {sortColumn === 'DEPENDENCIA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('FECHA_COMPRA')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Fecha de Compra {sortColumn === 'FECHA_COMPRA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('FECHA_ALTA')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Fecha de Alta {sortColumn === 'FECHA_ALTA' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('FECHA_REGISTRO')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Fecha Último Registro {sortColumn === 'FECHA_REGISTRO' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('ESTADO')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Estado {sortColumn === 'ESTADO' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('DISPOSICION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Disposición {sortColumn === 'DISPOSICION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th onClick={() => handleSort('EST_CONSERVACION')} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                                        Est. Conservación {sortColumn === 'EST_CONSERVACION' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Acción</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Observación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.CODIGO_PATRIMONIAL}>
                                        <td>{item.CODIGO_PATRIMONIAL}</td>
                                        <td>{item.DESCRIPCION}</td>
                                        <td>{item.TRABAJADOR}</td>
                                        <td>{item.DEPENDENCIA}</td>
                                        <td>{item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra'}</td>
                                        <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
                                        <td className='fw-bold'>{parseDate(item.FECHA_REGISTRO) || "Sin Registro"}</td>
                                        <td>
                                            {item.ESTADO === 0 ? (
                                                <span style={{ color: 'red', fontWeight: 'bold' }}> No Registrado</span>
                                            ) : (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Registrado</span>
                                            )}
                                        </td>
                                        <td>
                                            {item.DISPOSICION === 0 ? (
                                                <span style={{ color: 'red', fontWeight: 'bold' }}>de Baja</span>
                                            ) : (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Activo</span>
                                            )}
                                        </td>
                                        <td
                                            style={{
                                                fontWeight: 'bold',
                                                color:
                                                    item.EST_CONSERVACION === "Bueno"
                                                        ? "blue"
                                                        : item.EST_CONSERVACION === "Malo"
                                                            ? "#790303"
                                                            : item.EST_CONSERVACION === "Regular"
                                                                ? "purple"
                                                                : "black", // Color por defecto
                                            }}
                                        >
                                            {item.EST_CONSERVACION}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/edit/${item.CODIGO_PATRIMONIAL}`}
                                                className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                                            >
                                                ✏️ Editar
                                            </Link>
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    fontWeight: item.OBSERVACION ? 'bold' : 'normal',
                                                    fontStyle: item.OBSERVACION ? 'normal' : 'italic',
                                                    color: item.OBSERVACION ? '#000' : '#666', // Opcional: color diferenciado
                                                }}
                                            >
                                                {item.OBSERVACION ? item.OBSERVACION : 'Sin observación'}
                                            </span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className='fw-bold'
                                                onClick={() => handleEditObservation(item)}
                                            >
                                                📝 Añadir Observación
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal de edición de observaciones */}
                    <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Observación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <textarea
                                className="form-control"
                                rows={5}
                                value={newObservation}
                                onChange={(e) => setNewObservation(e.target.value)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setModalVisible(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={saveObservation}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            ) : (
                searchTerm1 && <p className="text-center text-danger fw-bold">No se encontraron bienes con los datos del trabajador.</p>
            )}
        </div>
    );
};


export default SearchMod1;