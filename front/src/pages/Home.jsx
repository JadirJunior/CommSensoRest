import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, BarChart3, Users, Award } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              CommSenso
              <span className="hero-subtitle">
                Monitoramento Inteligente de Compostagem
              </span>
            </h1>
            <p className="hero-description">
              Projeto de extensão do Instituto Federal de São Paulo - Campus Birigui.
              Atestamos a qualidade de processos de compostagem através de sensores IoT
              e análise de dados em tempo real.
            </p>
            <div className="hero-buttons">
              <Link to="/dados" className="btn btn-primary">
                <BarChart3 size={20} />
                Ver Dados
                <ArrowRight size={16} />
              </Link>
              <Link to="/historia" className="btn btn-secondary">
                Nossa História
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="sensor-visualization">
              <div className="sensor-item">
                <div className="sensor-icon">🌡️</div>
                <span>Temperatura</span>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon">💧</div>
                <span>Umidade</span>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon">⚗️</div>
                <span>pH</span>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon">🔋</div>
                <span>Condutividade</span>
              </div>
              <div className="sensor-item">
                <div className="sensor-icon">🧪</div>
                <span>NPK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Como Funciona</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Leaf />
              </div>
              <h3>Sensores IoT</h3>
              <p>
                Monitoramento contínuo de temperatura, umidade, pH, condutividade
                e níveis de NPK no processo de compostagem.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 />
              </div>
              <h3>Análise de Dados</h3>
              <p>
                Processamento em tempo real através de MQTT e API REST para
                análise da qualidade do processo.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award />
              </div>
              <h3>Certificação</h3>
              <p>
                Atestado de qualidade baseado em dados científicos para
                validação do processo de compostagem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">Tipos de Sensores</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Monitoramento</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Sustentável</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">IFSP</div>
              <div className="stat-label">Campus Birigui</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Faça Parte da Revolução Verde</h2>
            <p>
              Conheça nosso projeto e descubra como a tecnologia pode
              transformar a gestão de resíduos orgânicos.
            </p>
            <div className="cta-buttons">
              <Link to="/time" className="btn btn-primary">
                <Users size={20} />
                Conheça o Time
              </Link>
              <Link to="/edital" className="btn btn-outline">
                Edital 273/2023
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 