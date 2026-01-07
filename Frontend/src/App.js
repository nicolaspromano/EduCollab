import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas Principais e de Login
import Home from './pages/Home';
import LoginSelection from './pages/login/LoginSelection';
import Register from './pages/register/Register';

// Páginas do Professor
import ProfessorHome from './pages/professor/ProfessorHome';
import ProfessorPerfil from './pages/professor/ProfessorPerfil';
import BancoQuestoesProfessor from './pages/professor/BancoQuestoesProfessor';
import SistemaProvas from './pages/professor/SistemaProvas';

// Páginas do Aluno
import AlunoHome from './pages/aluno/AlunoHome';
import AlunoPerfil from './pages/aluno/AlunoPerfil.js';
import BancoQuestoesAluno from './pages/aluno/BancoQuestoesAluno';

// Páginas do Fórum
import ForumDuvidasAluno from './pages/forumAluno/ForumDuvidasAluno';
import TopicoDetalheAluno from './pages/forumAluno/TopicoDetalheAluno';

import ForumDuvidasProfessor from './pages/forumProfessor/ForumDuvidasProfessor';
import TopicoDetalheProfessor from './pages/forumProfessor/TopicoDetalheProfessor';

// Proteção de rotas
import { AlunoRoute, ProfessorRoute } from './pages/login/ProtectedRoutes.jsx'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Principal */}
        <Route path="/" element={<Home />} />

        {/* Rota para a tela de seleção de Login */}
        <Route path="/login-selection" element={<LoginSelection />} />

        {/* Rota para a tela de seleção de Register */}
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas do Professor*/}
        <Route element={<ProfessorRoute />}>
          {/* Rotas do Professor */}
          <Route path="/professor/home" element={<ProfessorHome />} />
          <Route path="/professor/perfil" element={<ProfessorPerfil />} />
          <Route path="/professor/banco-questoes" element={<BancoQuestoesProfessor />} />
          <Route path="/professor/provas" element={<SistemaProvas />} />
          <Route path="/professor/forumProfessor" element={<ForumDuvidasProfessor />} />
          <Route path="/professor/forumProfessor/topico/:id" element={<TopicoDetalheProfessor />} />
        </Route>
        
        {/* Rotas protegidas do Aluno*/}
        <Route element={<AlunoRoute />}>
          {/* Rotas do Aluno */}
          <Route path="/aluno/home" element={<AlunoHome />} /> 
          <Route path="/aluno/perfil" element={<AlunoPerfil />} />
          <Route path="/aluno/banco-questoes" element={<BancoQuestoesAluno />} />
          <Route path="/aluno/forumAluno" element={<ForumDuvidasAluno />} />
          <Route path="/aluno/forumAluno/topico/:id" element={<TopicoDetalheAluno />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
