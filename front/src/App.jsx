import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Historia from './pages/Historia';
import Time from './pages/Time';
import Portfolio from './pages/Portfolio';
import Dados from './pages/Dados';
import './styles/App.css';

const Edital = () => (
  <div className="page">
    <div className="container">
      <div className="page-header">
        <h1>Edital 273/2023</h1>
        <p>Informações sobre o edital que fundamenta nosso projeto</p>
      </div>
      <div className="content">
        <section>
          <h2>Sobre o Edital</h2>
          <p>
            O Edital 273/2023 é um programa de fomento à pesquisa e extensão 
            universitária que visa promover o desenvolvimento de projetos 
            inovadores na área de sustentabilidade e tecnologia.
          </p>
          <p>
            Nosso projeto CommSenso foi contemplado neste edital por sua 
            proposta inovadora de monitoramento inteligente de compostagem 
            através de sensores IoT.
          </p>
        </section>
      </div>
    </div>
  </div>
);

const CriseClimatica = () => (
  <div className="page">
    <div className="container">
      <div className="page-header">
        <h1>Crise Climática</h1>
        <p>Como nosso projeto contribui para um futuro mais sustentável</p>
      </div>
      <div className="content">
        <section>
          <h2>O Desafio Ambiental</h2>
          <p>
            A crise climática exige soluções inovadoras para reduzir o impacto 
            ambiental das atividades humanas. O gerenciamento adequado de 
            resíduos orgânicos é uma peça fundamental neste quebra-cabeças.
          </p>
        </section>
        <section>
          <h2>Nossa Contribuição</h2>
          <p>
            O projeto CommSenso contribui diretamente para a mitigação dos 
            efeitos da crise climática ao:
          </p>
          <ul>
            <li>Otimizar processos de compostagem</li>
            <li>Reduzir a produção de metano em aterros</li>
            <li>Promover a economia circular</li>
            <li>Educar sobre práticas sustentáveis</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/time" element={<Time />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/edital" element={<Edital />} />
            <Route path="/crise-climatica" element={<CriseClimatica />} />
            <Route path="/dados" element={<Dados />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
