import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Explorar from "./components/Explorar";
import SuasTags from "./components/SuasTags";
import Mensagens from "./components/Mensagens";
import Notificacoes from "./components/Notificacoes";
import Perfil from "./components/Perfil";
import Comunidades from "./components/Comunidades";
import Login from "./components/Login";
import Register from "./components/Register";
import RotaProtegida from "./components/RotaProtegida";
import ServerStatus from "./components/ServerStatus";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

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
          <Route path="/explorar" element={
            <RotaProtegida>
              <Explorar />
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
          <Route path="/comunidades" element={
            <RotaProtegida>
              <Comunidades />
            </RotaProtegida>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
