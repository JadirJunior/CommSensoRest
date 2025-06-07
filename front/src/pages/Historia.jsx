import { Calendar, Users, Target } from 'lucide-react';
import '../styles/Page.css';

const Historia = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Nossa História</h1>
          <p>A jornada do projeto CommSenso no Instituto Federal de São Paulo</p>
        </div>

        <div className="content">
          <section className="timeline">
            <div className="timeline-item">
              <div className="timeline-icon">
                <Calendar />
              </div>
              <div className="timeline-content">
                <h3>2023 - Início do Projeto</h3>
                <p>
                  O projeto CommSenso nasceu da necessidade de criar soluções 
                  sustentáveis para o gerenciamento de resíduos orgânicos no 
                  campus do IFSP Birigui.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon">
                <Target />
              </div>
              <div className="timeline-content">
                <h3>Desenvolvimento de Sensores</h3>
                <p>
                  Desenvolvimento e implementação de sensores IoT para 
                  monitoramento de temperatura, umidade, pH, condutividade 
                  e níveis de NPK no processo de compostagem.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon">
                <Users />
              </div>
              <div className="timeline-content">
                <h3>Formação da Equipe</h3>
                <p>
                  Consolidação de uma equipe multidisciplinar de estudantes 
                  e professores dedicados à pesquisa e desenvolvimento de 
                  tecnologias sustentáveis.
                </p>
              </div>
            </div>
          </section>

          <section className="mission">
            <h2>Nossa Missão</h2>
            <p>
              Desenvolver tecnologias inovadoras para o monitoramento e 
              controle de qualidade em processos de compostagem, contribuindo 
              para a sustentabilidade ambiental e a educação tecnológica.
            </p>
          </section>

          <section className="vision">
            <h2>Nossa Visão</h2>
            <p>
              Ser referência em pesquisa e desenvolvimento de soluções IoT 
              para sustentabilidade, formando profissionais capacitados para 
              enfrentar os desafios ambientais do futuro.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Historia; 