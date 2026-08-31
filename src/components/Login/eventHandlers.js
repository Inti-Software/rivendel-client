import { login } from '../../auth/auth.api.js';

export const handleLogin = (e, state, dispatch) => {
  e.preventDefault();

	const submitFail = (error) => dispatch({ type: 'SUBMIT_FAIL', error })

  const email = state.email?.trim() || '';
  const password = state.password || '';

  if (!email) {
    return submitFail('Ingrese un correo electrónico');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return submitFail('Ingrese un correo electrónico válido');
  }

  if (!password) {
    return submitFail('Ingrese una contraseña');
  } else if (password.length < 6) {
    return submitFail('La contraseña debe tener al menos 6 caracteres');
  }

  dispatch({ type: 'SUBMIT_START' });
  login(state.email, state.password).then((result) => {
    if (result.error) {
      submitFail(result.message || 'Error al iniciar sesión.');
    } else {
      dispatch({ type: 'SUBMIT_SUCCESS', authData: result.data });
    }
  });
};
