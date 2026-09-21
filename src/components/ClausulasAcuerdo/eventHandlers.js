import { Banking } from '../../api/repositories/banking.js'

export function handleKeyDown(event) {
  if (event.key === 'Enter') handleSubmit(event);
  if (event.key === 'Escape') onCancel(event);
}

export async function onBlurAliasCuenta(e, dispatch) {
  const alias = e.target.value;
  if (alias.trim() === '') return;
  dispatch({ type: 'LOAD_CUENTA_START' });
  const { ok, data } = await Banking.getData(alias);
  if (ok) {
    const cuenta = {
      titular: data.titular,
      cuilTitular: data.cuilTitular,
      entidad: data.bancoDestino,
      alias: alias,
    };
    dispatch({ type: 'UPDATE_CUENTA', payload: cuenta });
  }
  dispatch({ type: 'LOAD_CUENTA_END' });
}
