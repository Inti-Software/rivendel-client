import { login } from '../../auth/auth.api.js';
import { setToken } from "../../api/tokenStore.js";

export function Login() {
  const handleLogin = async () => {
    const { accessToken } = await login('maria@test.com', '123456');
    setToken(accessToken);
  };

  return <button onClick={handleLogin}>Login</button>;
}
