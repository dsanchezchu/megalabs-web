import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Autocomplete,
} from "@mui/material";
import {
    fetchMetodosAnaliticos,
    buscarEstudios,
    registrarEstudioClinico,
    actualizarEstudioClinico,
} from "../../services/EstudioClinicoService";
import { fetchClientes } from "../../services/ClientesService";
import { fetchProductos } from "../../services/ProductoService"; // Importar el servicio de productos

const EstudiosClinicos = () => {
    const { control, handleSubmit, reset } = useForm();
    const [estudios, setEstudios] = useState([]);
    const [metodosAnaliticos, setMetodosAnaliticos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]); // Estado para los productos
    const [searchType, setSearchType] = useState("producto");
    const [searchValue, setSearchValue] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingEstudio, setEditingEstudio] = useState(null);

    // Cargar datos iniciales: métodos analíticos, clientes y productos
    useEffect(() => {
        const initData = async () => {
            try {
                const metodos = await fetchMetodosAnaliticos();
                setMetodosAnaliticos(metodos);

                const clientesData = await fetchClientes();
                setClientes(clientesData);

                const productosData = await fetchProductos();
                setProductos(productosData);

                buscar();
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            }
        };
        initData();
    }, []);

    // Buscar estudios clínicos
    const buscar = async () => {
        try {
            const params = {
                [searchType]: searchValue,
            };
            const estudiosData = await buscarEstudios(params);
            setEstudios(estudiosData);
            console.log("Estudios clínicos:", estudiosData); // Verifica los datos aquí
        } catch (error) {
            console.error("Error al buscar estudios clínicos:", error);
        }
    };

    // Abrir diálogo de creación/edición
    const abrirDialogo = (estudio = null) => {
        setEditingEstudio(estudio);
        setOpenDialog(true);
    
        if (estudio) {
            console.log("Estudio en edición:", estudio); // Log para verificar datos
            const metodosIds = metodosAnaliticos
                .filter(metodo => estudio.metodosAnaliticos.includes(metodo.nombre))
                .map(metodo => metodo.idMetodo);
    
            reset({
                productoId: estudio.productoId,
                clienteRuc: estudio.clienteRuc,
                fecha: new Date(estudio.fechaAuditoria).toISOString().split('T')[0],
                resultado: estudio.resultado,
                metodosAnaliticosIds: metodosIds,
                estado: estudio.estado,
            });
        }
    };    

    // Registrar o actualizar un estudio clínico
    const onSubmit = async (data) => {
        try {
            const body = {
                idControl: editingEstudio.idControl,
                productoId: editingEstudio.productoId,
                fecha: editingEstudio.fecha,
                metodosAnaliticosIds: editingEstudio.metodosAnaliticosIds,
                clienteRuc: editingEstudio.clienteRuc,
                ...data,
            };
    
            console.log("Datos enviados:", body);
    
            await actualizarEstudioClinico(editingEstudio.idControl, body);
    
            buscar();
            setOpenDialog(false);
        } catch (error) {
            console.error("Error al guardar el estudio clínico:", error);
        }
    };

    return (
        <div>
            {/* Barra de búsqueda */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <MenuItem value="producto">Producto</MenuItem>
                    <MenuItem value="cliente">Cliente</MenuItem>
                    <MenuItem value="fechaInicio">Fecha Inicio</MenuItem>
                    <MenuItem value="fechaFin">Fecha Fin</MenuItem>
                </Select>
                <TextField
                    label="Buscar"
                    type={searchType.includes("fecha") ? "date" : "text"}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputLabelProps={searchType.includes("fecha") ? { shrink: true } : {}}
                />
                <Button variant="contained" onClick={buscar}>
                    Buscar
                </Button>
            </div>

            {/* Tabla de estudios clínicos */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Resultado</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Métodos Analíticos</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {estudios.map((estudio) => (
                            <TableRow key={estudio.idControl}>
                                <TableCell>{estudio.nombreProducto}</TableCell>
                                <TableCell>{estudio.nombreMedico}</TableCell>
                                <TableCell>{new Date(estudio.fechaAuditoria).toLocaleDateString()}</TableCell>
                                <TableCell>{estudio.resultado}</TableCell>
                                <TableCell>{estudio.estado}</TableCell>
                                <TableCell>{estudio.metodosAnaliticos.join(", ")}</TableCell>
                                <TableCell>
                                    <Button onClick={() => abrirDialogo(estudio)}>Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* Diálogo de registro/edición */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editingEstudio ? "Editar" : "Registrar"} Estudio Clínico</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {editingEstudio ? (
                            // Modo edición: solo mostrar estado y resultado
                            <>
                                <Controller
                                    name="resultado"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField 
                                            {...field} 
                                            label="Resultado" 
                                            fullWidth 
                                            multiline
                                            rows={4}
                                            sx={{ 
                                                mt: 2, 
                                                mb: 2,
                                                '& .MuiInputBase-root': {
                                                    minHeight: '120px'
                                                }
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="estado"
                                    control={control}
                                    render={({ field }) => (
                                        <Select 
                                            {...field} 
                                            fullWidth 
                                            label="Estado"
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            <MenuItem value="EN_PRUEBAS">En Pruebas</MenuItem>
                                            <MenuItem value="RECHAZADO">Rechazado</MenuItem>
                                            <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                                            <MenuItem value="APROBADO">Aprobado</MenuItem>
                                        </Select>
                                    )}
                                />
                            </>
                        ) : (
                            // Modo registro: mantener el formulario original
                            <>
                                <Controller
                                    name="productoId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Autocomplete
                                            options={productos}
                                            getOptionLabel={(option) => 
                                                typeof option === 'string' 
                                                    ? option 
                                                    : option?.nombre 
                                                        ? `${option.nombre} (${option.idProducto})`
                                                        : ''
                                            }
                                            value={productos.find(p => p.idProducto === field.value) || null}
                                            onChange={(_, newValue) => field.onChange(newValue?.idProducto || "")}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    label="Producto" 
                                                    fullWidth 
                                                    margin="normal"
                                                    required 
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <Controller
                                    name="clienteRuc"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Autocomplete
                                            options={clientes}
                                            getOptionLabel={(option) => 
                                                typeof option === 'string'
                                                    ? option
                                                    : option?.nombre
                                                        ? `${option.nombre} (${option.ruc})`
                                                        : ''
                                            }
                                            value={clientes.find(c => c.ruc === field.value) || null}
                                            onChange={(_, newValue) => field.onChange(newValue?.ruc || "")}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    label="Cliente" 
                                                    fullWidth 
                                                    margin="normal"
                                                    required 
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <Controller
                                    name="metodosAnaliticosIds"
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            multiple
                                            fullWidth
                                            margin="normal"
                                            value={field.value || []}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        >
                                            {metodosAnaliticos.map((metodo) => (
                                                <MenuItem key={metodo.idMetodo} value={metodo.idMetodo}>
                                                    {metodo.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name="fecha"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Fecha" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                                    )}
                                />
                                <Controller
                                    name="resultado"
                                    control={control}
                                    render={({ field }) => <TextField {...field} label="Resultado" fullWidth margin="normal" />}
                                />
                            </>
                        )}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit(onSubmit)} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EstudiosClinicos;