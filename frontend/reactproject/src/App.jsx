import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Explorar from "./components/Explorar";
import SuasTags from "./components/SuasTags";
import Mensagens from "./components/Mensagens";
import Notificacoes from "./components/Notificacoes";
import Perfil from "./components/Perfil";
import Comunidades from "./components/Comunidades";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/tags" element={<SuasTags />} />
        <Route path="/mensagens" element={<Mensagens />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/comunidades" element={<Comunidades />} />
      </Routes>
    </Router>
  );
}

export default App;
