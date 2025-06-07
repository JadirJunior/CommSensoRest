import { Users, Mail, Linkedin, Github, GraduationCap } from 'lucide-react';
import '../styles/Page.css';
import '../styles/Time.css';

const Time = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Prof. Dr. João Silva",
      role: "Coordenador do Projeto",
      description: "Doutor em Engenharia Ambiental com foco em tecnologias sustentáveis",
      image: "👨‍🏫",
      email: "joao.silva@ifsp.edu.br",
      linkedin: "#",
      specialties: ["IoT", "Sustentabilidade", "Compostagem"]
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "Desenvolvedora Backend",
      description: "Estudante de Tecnologia em Análise e Desenvolvimento de Sistemas",
      image: "👩‍💻",
      email: "maria.santos@estudante.ifsp.edu.br",
      github: "#",
      specialties: ["Node.js", "PostgreSQL", "API REST"]
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      role: "Especialista em IoT",
      description: "Estudante de Engenharia Elétrica especializado em sensores",
      image: "👨‍🔧",
      email: "pedro.oliveira@estudante.ifsp.edu.br",
      github: "#",
      specialties: ["Arduino", "Sensores", "MQTT"]
    },
    {
      id: 4,
      name: "Ana Costa",
      role: "Desenvolvedora Frontend",
      description: "Estudante de Ciência da Computação focada em UX/UI",
      image: "👩‍🎨",
      email: "ana.costa@estudante.ifsp.edu.br",
      linkedin: "#",
      specialties: ["React", "CSS", "Design"]
    },
    {
      id: 5,
      name: "Carlos Ferreira",
      role: "Analista de Dados",
      description: "Estudante de Estatística especializado em análise de dados ambientais",
      image: "👨‍📊",
      email: "carlos.ferreira@estudante.ifsp.edu.br",
      linkedin: "#",
      specialties: ["Python", "Análise de Dados", "Estatística"]
    },
    {
      id: 6,
      name: "Profa. Dra. Lucia Mendes",
      role: "Consultora em Sustentabilidade",
      description: "Doutora em Ciências Ambientais e especialista em gestão de resíduos",
      image: "👩‍🏫",
      email: "lucia.mendes@ifsp.edu.br",
      linkedin: "#",
      specialties: ["Gestão Ambiental", "Compostagem", "Pesquisa"]
    }
  ];

  return (
    <div className="page time-page">
      <div className="container">
        <div className="page-header">
          <h1>
            <Users size={40} />
            Nosso Time
          </h1>
          <p>Conheça a equipe multidisciplinar por trás do projeto CommSenso</p>
        </div>

        <div className="team-intro">
          <div className="intro-content">
            <h2>Uma Equipe Diversa e Especializada</h2>
            <p>
              O projeto CommSenso é resultado do trabalho colaborativo de professores e estudantes 
              do Instituto Federal de São Paulo - Campus Birigui. Nossa equipe combina conhecimentos 
              em engenharia, computação, ciências ambientais e análise de dados para criar soluções 
              inovadoras para sustentabilidade.
            </p>
          </div>
        </div>

        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-card">
              <div className="member-avatar">
                <span className="avatar-emoji">{member.image}</span>
              </div>
              
              <div className="member-info">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.description}</p>
                
                <div className="specialties">
                  {member.specialties.map((specialty, index) => (
                    <span key={index} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="member-links">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="contact-link">
                      <Mail size={18} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} className="contact-link">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} className="contact-link">
                      <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="team-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <GraduationCap />
              </div>
              <div className="stat-content">
                <h3>6</h3>
                <p>Membros da Equipe</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Users />
              </div>
              <div className="stat-content">
                <h3>4</h3>
                <p>Cursos Envolvidos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Mail />
              </div>
              <div className="stat-content">
                <h3>100%</h3>
                <p>Dedicação ao Projeto</p>
              </div>
            </div>
          </div>
        </div>

        <div className="join-team">
          <h2>Quer Fazer Parte do Time?</h2>
          <p>
            Estamos sempre em busca de estudantes e professores interessados em 
            contribuir com projetos de sustentabilidade e tecnologia. Entre em contato!
          </p>
          <div className="join-buttons">
            <a href="mailto:commsenso@ifsp.edu.br" className="btn btn-primary">
              <Mail size={20} />
              Entre em Contato
            </a>
            <a href="/edital" className="btn btn-secondary">
              Saiba Mais sobre o Projeto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Time; 