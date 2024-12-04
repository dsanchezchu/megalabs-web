import Swal from 'sweetalert2';

export const showSuccessAlert = (message) => {
    return Swal.fire({
        title: '¡Éxito!',
        text: message,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6'
    });
};

export const showErrorAlert = (message) => {
    return Swal.fire({
        title: '¡Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
    });
};

export const showWarningAlert = (message) => {
    return Swal.fire({
        title: '¡Advertencia!',
        text: message,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f8bb86'
    });
};

export const showConfirmDialog = (message) => {
    return Swal.fire({
        title: '¿Estás seguro?',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    });
}; 