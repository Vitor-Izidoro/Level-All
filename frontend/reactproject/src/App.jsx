import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Explorar from "./components/pages/Explorar";
import SuasTags from "./components/pages/SuasTags";
import Mensagens from "./components/mensagens/Mensagens";
import Notificacoes from "./components/pages/Notificacoes";
import Perfil from "./components/perfil/Perfil";
import EditProfile from "./components/perfil/EditProfile";
import Comunidades from "./components/comunidades/Comunidades";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RotaProtegida from "./components/shared/RotaProtegida";
import ServerStatus from "./components/shared/ServerStatus";
import Autenticacao from "./components/auth/Autenticacao"; 
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import CriarComunidade from "./components/comunidades/CriarComunidade";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ServerStatus />        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          
          {/* Rotas protegidas - requerem autenticação */}
          <Route path="/comunidades" element={
            <RotaProtegida>
              <Comunidades />
            </RotaProtegida>
          } />
          <Route path="/comunidades/criar" element={
            <RotaProtegida>
              <CriarComunidade />
            </RotaProtegida>
          } />
          <Route path="/tags" element={
            <RotaProtegida>
              <SuasTags />
            </RotaProtegida>
          } />
          <Route path="/mensagens" element={
            <RotaProtegida>
              <Mensagens />
            </RotaProtegida>
          } />
          <Route path="/notificacoes" element={
            <RotaProtegida>
              <Notificacoes />
            </RotaProtegida>
          } />
          <Route path="/perfil" element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          } />
          <Route path="/editar-perfil" element={
            <RotaProtegida>
              <EditProfile />
            </RotaProtegida>
          } />
          <Route path="/autenticacao" element={
            <RotaProtegida>
              <Autenticacao />
            </RotaProtegida>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
