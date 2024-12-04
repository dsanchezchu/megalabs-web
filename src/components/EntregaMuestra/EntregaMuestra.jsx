import React, { useState } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Typography,
    Box,
    Grid,
    Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const EntregaMuestra = () => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            lugar: '',
            fecha: new Date(),
            estado: 'PENDIENTE',
            productoId: '',
            cantidad: '',
            lote: '',
            fechaCaducidad: null,
            comentarios: '',
            receptor: ''
        }
    });

    const [alertMessage, setAlertMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');

    const validateExpiryDate = (date) => {
        if (!date) return true;

        const today = new Date();
        const expiryDate = new Date(date);

        if (expiryDate < today) {
            return "La fecha de caducidad no puede ser anterior a hoy";
        }

        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        if (expiryDate <= threeMonthsFromNow) {
            setAlertMessage({
                severity: 'warning',
                message: "¡Advertencia! Esta muestra caducará en los próximos 3 meses"
            });
        } else {
            setAlertMessage(null);
        }

        return true;
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/entrega-muestra`, {
                lugar: data.lugar,
                fecha: data.fecha,
                estado: 'PENDIENTE',
                productoId: data.productoId,
                cantidad: data.cantidad,
                lote: data.lote,
                fechaCaducidad: data.fechaCaducidad,
                comentarios: data.comentarios,
                receptor: data.receptor
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAlertMessage({
                severity: 'success',
                message: 'Muestra registrada exitosamente'
            });
            reset();
        } catch (error) {
            console.error('Error al registrar la muestra:', error);
            setAlertMessage({
                severity: 'error',
                message: 'Error al registrar la muestra: ' + (error.response?.data?.message || 'Error desconocido')
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ p: 3 }}>
                <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Registro de Entrega de Muestras
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="productoId"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="ID del Producto"
                                            fullWidth
                                            error={!!errors.productoId}
                                            helperText={errors.productoId?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="cantidad"
                                    control={control}
                                    rules={{
                                        required: 'Este campo es requerido',
                                        min: { value: 1, message: 'La cantidad debe ser mayor a 0' }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            label="Cantidad"
                                            fullWidth
                                            error={!!errors.cantidad}
                                            helperText={errors.cantidad?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="lote"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Número de Lote"
                                            fullWidth
                                            error={!!errors.lote}
                                            helperText={errors.lote?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="fechaCaducidad"
                                    control={control}
                                    rules={{
                                        required: 'Este campo es requerido',
                                        validate: validateExpiryDate
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Fecha de Caducidad"
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errors.fechaCaducidad,
                                                    helperText: errors.fechaCaducidad?.message
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="comentarios"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Comentarios"
                                            multiline
                                            rows={4}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="lugar"
                                    control={control}
                                    rules={{ required: 'El lugar es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Lugar"
                                            fullWidth
                                            error={!!errors.lugar}
                                            helperText={errors.lugar?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="fecha"
                                    control={control}
                                    rules={{ required: 'La fecha es requerida' }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Fecha de Entrega"
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errors.fecha,
                                                    helperText: errors.fecha?.message
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {alertMessage && (
                                <Grid item xs={12}>
                                    <Alert severity={alertMessage.severity}>
                                        {alertMessage.message}
                                    </Alert>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Registrando...' : 'Registrar Entrega'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};

export default EntregaMuestra;
