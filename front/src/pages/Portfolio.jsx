import { Award, Calendar, ExternalLink, Github, Zap, Target, Users } from 'lucide-react';
import '../styles/Page.css';
import '../styles/Portfolio.css';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "Sistema de Monitoramento IoT",
      description: "Desenvolvimento de uma rede de sensores IoT para monitoramento em tempo real de parâmetros de compostagem",
      image: "🌐",
      technologies: ["Arduino", "ESP32", "MQTT", "Node.js"],
      status: "Concluído",
      year: "2024",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      id: 2,
      title: "API REST CommSenso",
      description: "Backend robusto para coleta, processamento e análise de dados dos sensores de compostagem",
      image: "⚙️",
      technologies: ["Node.js", "PostgreSQL", "Express", "Sequelize"],
      status: "Concluído",
      year: "2024",
      links: {
        demo: "http://localhost:3000",
        github: "#"
      }
    },
    {
      id: 3,
      title: "Dashboard Web",
      description: "Interface web responsiva para visualização e gerenciamento dos dados de monitoramento",
      image: "📊",
      technologies: ["React", "CSS3", "Axios", "Vite"],
      status: "Concluído",
      year: "2024",
      links: {
        demo: "http://localhost:5173",
        github: "#"
      }
    },
    {
      id: 4,
      title: "Algoritmo de Análise de Qualidade",
      description: "Sistema inteligente para avaliação da qualidade do processo de compostagem baseado em dados históricos",
      image: "🧠",
      technologies: ["Python", "Pandas", "NumPy", "Machine Learning"],
      status: "Em desenvolvimento",
      year: "2024",
      links: {
        github: "#"
      }
    },
    {
      id: 5,
      title: "App Mobile de Monitoramento",
      description: "Aplicativo móvel para acompanhamento remoto do processo de compostagem",
      image: "📱",
      technologies: ["React Native", "Expo", "TypeScript"],
      status: "Planejado",
      year: "2025",
      links: {}
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Projeto Aprovado no Edital 273/2023",
      description: "Projeto selecionado para financiamento público de pesquisa em sustentabilidade",
      date: "2023",
      icon: "🏆"
    },
    {
      id: 2,
      title: "Apresentação na Semana de Tecnologia IFSP",
      description: "Demonstração do sistema para comunidade acadêmica e empresarial",
      date: "2024",
      icon: "🎤"
    },
    {
      id: 3,
      title: "Publicação de Artigo Científico",
      description: "Artigo sobre IoT aplicado à sustentabilidade em revista especializada",
      date: "2024",
      icon: "📄"
    },
    {
      id: 4,
      title: "Parceria com Empresas Locais",
      description: "Estabelecimento de parcerias para implementação do sistema em escala comercial",
      date: "2024",
      icon: "🤝"
    }
  ];

  const stats = [
    { label: "Projetos Desenvolvidos", value: "5", icon: <Target /> },
    { label: "Tecnologias Utilizadas", value: "15+", icon: <Zap /> },
    { label: "Sensores Implementados", value: "7", icon: <Award /> },
    { label: "Dados Coletados", value: "1000+", icon: <Users /> }
  ];

  return (
    <div className="page portfolio-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <Award size={40} />
            Portfólio
          </h1>
          <p>Nossos projetos, conquistas e contribuições para a sustentabilidade</p>
        </div>

        {/* Stats Overview */}
        <div className="portfolio-stats">
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <section className="projects-section">
          <h2>Nossos Projetos</h2>
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <div className="project-icon">{project.image}</div>
                  <div className="project-status">
                    <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-tech">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="project-footer">
                    <div className="project-year">
                      <Calendar size={16} />
                      {project.year}
                    </div>
                    
                    <div className="project-links">
                      {project.links.demo && (
                        <a href={project.links.demo} className="project-link" target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {project.links.github && (
                        <a href={project.links.github} className="project-link" target="_blank" rel="noopener noreferrer">
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <h2>Conquistas e Reconhecimentos</h2>
          <div className="achievements-timeline">
            {achievements.map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <div className="achievement-date">{achievement.date}</div>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="impact-section">
          <div className="impact-content">
            <h2>Impacto do Projeto</h2>
            <div className="impact-grid">
              <div className="impact-item">
                <h3>🌱 Sustentabilidade</h3>
                <p>Contribuição direta para práticas sustentáveis de gestão de resíduos orgânicos</p>
              </div>
              <div className="impact-item">
                <h3>🎓 Educação</h3>
                <p>Formação de estudantes em tecnologias emergentes e práticas ambientais</p>
              </div>
              <div className="impact-item">
                <h3>🔬 Inovação</h3>
                <p>Desenvolvimento de soluções tecnológicas inovadoras para desafios ambientais</p>
              </div>
              <div className="impact-item">
                <h3>🤝 Comunidade</h3>
                <p>Engajamento com a comunidade local e empresas do setor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="portfolio-cta">
          <h2>Interessado em Colaborar?</h2>
          <p>
            Estamos sempre abertos a novas parcerias e colaborações. 
            Entre em contato para saber como podemos trabalhar juntos!
          </p>
          <div className="cta-buttons">
            <a href="mailto:commsenso@ifsp.edu.br" className="btn btn-primary">
              Entre em Contato
            </a>
            <a href="/dados" className="btn btn-secondary">
              Ver Dados do Projeto
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio; 