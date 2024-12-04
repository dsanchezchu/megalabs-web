import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/apiConfig';

export default function PasswordRecoveryFlow() {
  const [email, setEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('request'); // 'request', 'verify', 'success'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestRecovery = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/auth/recover-password`, { email });
      setStep('verify');
    } catch (error) {
      console.error('Error al solicitar la recuperación:', error);
      setError('Hubo un problema al enviar el correo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify-recovery-token`, {
        params: { token: recoveryToken }
      });
      
      const { token, nombre, role , dni} = response.data;
      
      // Guardar la información en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('role', role);
      localStorage.setItem('dni', dni);
      
      setStep('success');
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error al verificar el token:', error);
      setError(error.response?.data || 'Token inválido o expirado. Por favor, solicita un nuevo código.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        {step === 'request' && (
          <>
            <p className="text-gray-600 mb-6">
              Ingresa tu correo electrónico para recibir un código de recuperación.
            </p>
            <form onSubmit={handleRequestRecovery} className="space-y-4">
              <div className="input input-bordered flex items-center gap-2 focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-transparent bg-gray-100 rounded-md">
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="grow bg-gray-100 text-gray-800 focus:outline-none rounded-md"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary w-full hover:bg-primary-focus transition duration-200 ease-in-out ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  'Enviar código de recuperación'
                )}
              </button>
            </form>
          </>
        )}
        {step === 'verify' && (
          <>
            <p className="text-gray-600 mb-6">
              Ingresa el código de recuperación que hemos enviado a tu correo electrónico.
            </p>
            <form onSubmit={handleVerifyToken} className="space-y-4">
              <div className="input input-bordered flex items-center gap-2 focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-transparent bg-gray-100 rounded-md">
                <input
                  type="text"
                  placeholder="Código de recuperación"
                  value={recoveryToken}
                  onChange={(e) => setRecoveryToken(e.target.value)}
                  required
                  className="grow bg-gray-100 text-gray-800 focus:outline-none rounded-md"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary w-full hover:bg-primary-focus transition duration-200 ease-in-out ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  'Verificar código'
                )}
              </button>
            </form>
          </>
        )}
        {step === 'success' && (
          <div className="flex flex-col items-center space-y-2 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-lg font-semibold text-gray-800">¡Verificación exitosa!</p>
            <p className="text-sm text-gray-600">
              Serás redirigido al dashboard en unos segundos...
            </p>
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

