import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * Hook síncrono para verificar se existe um token
 * e se ele já expirou.
 * Isso é uma verificação de UX, não de segurança.
 * A segurança real é validada pelo backend.
 */
const useAuth = () => {
  const token = localStorage.getItem('token');

  // Sem token
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Pega o tempo de expiração (em milissegundos)
    const expirationTime = decodedToken.exp * 1000;

    // Compara com o tempo atual
    if (expirationTime < Date.now()) {
      // O token expirou
      console.warn("Token expirado removido");
      localStorage.removeItem('token');
      return false;
    }

    // Token existe e ainda não expirou
    return true;

  } catch (error) {
    // Erro ao decodificar (token mal-formado)
    console.error("Token inválido removido", error);
    localStorage.removeItem('token');
    return false;
  }
};

export const AlunoRoute = () => {
  const isAuth = useAuth();
  const user_type = localStorage.getItem('user_type')

  // Se o aluno estiver autenticado, renderiza o componente filho (Outlet)
  // Se não, redireciona para a página de login
  return (user_type === 'student' && isAuth) ? <Outlet /> : <Navigate to="/login-selection" replace />;
};

export const ProfessorRoute = () => {
  const isAuth = useAuth();
  const user_type = localStorage.getItem('user_type')

  // Se o professor estiver autenticado, renderiza o componente filho (Outlet)
  // Se não, redireciona para a página de login
  return (user_type === 'teacher' && isAuth) ? <Outlet /> : <Navigate to="/login-selection" replace />;
};