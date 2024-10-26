import React from 'react';

const LoginPageMain = () => {
    return (
        <form className="space-y-4 w-full max-w-md">
            <div className="form-control">
                <label className="label" htmlFor="dni">
                    <span className="label-text">DNI del Representante</span>
                </label>
                <input
                    type="text"
                    id="dni"
                    placeholder="Ingrese su DNI"
                    className="input input-bordered w-full"
                    required
                />
            </div>
            <div className="form-control">
                <label className="label" htmlFor="password">
                    <span className="label-text">Contraseña</span>
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full"
                    required
                />
            </div>
            <div className="flex items-center justify-between">
                <label className="label cursor-pointer">
                    <input type="checkbox" className="checkbox checkbox-primary" />
                    <span className="label-text ml-2">Recordarme</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
            <button type="submit" className="btn btn-primary w-full">
                Iniciar sesión
            </button>
        </form>
    )
}

export default LoginPageMain;


