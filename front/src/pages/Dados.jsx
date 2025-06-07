import { useState, useEffect } from 'react';
import { BarChart3, Thermometer, Droplet, Activity, Plus, Trash2, RefreshCw } from 'lucide-react';
import { measureService, sensorService, containerService } from '../services/api';
import '../styles/Dados.css';

const Dados = () => {
  const [measures, setMeasures] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('measures');
  const [newMeasure, setNewMeasure] = useState({
    value: '',
    dtMeasure: '',
    sensorId: '',
    container: ''
  });
  const [newSensor, setNewSensor] = useState({
    name: '',
    unit: ''
  });
  const [newContainer, setNewContainer] = useState({
    name: '',
    weigth: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [measuresRes, sensorsRes, containersRes] = await Promise.all([
        measureService.getAll(),
        sensorService.getAll(),
        containerService.getAll()
      ]);
      
      setMeasures(measuresRes.data.data || []);
      setSensors(sensorsRes.data.data || []);
      setContainers(containersRes.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMeasure = async (e) => {
    e.preventDefault();
    try {
      await measureService.create(newMeasure);
      setNewMeasure({ value: '', dtMeasure: '', sensorId: '', container: '' });
      fetchData();
    } catch (error) {
      console.error('Erro ao criar medição:', error);
    }
  };

  const handleCreateSensor = async (e) => {
    e.preventDefault();
    try {
      await sensorService.create(newSensor);
      setNewSensor({ name: '', unit: '' });
      fetchData();
    } catch (error) {
      console.error('Erro ao criar sensor:', error);
    }
  };

  const handleCreateContainer = async (e) => {
    e.preventDefault();
    try {
      await containerService.create(newContainer);
      setNewContainer({ name: '', weigth: '' });
      fetchData();
    } catch (error) {
      console.error('Erro ao criar container:', error);
    }
  };

  const handleDeleteMeasure = async (id) => {
    try {
      await measureService.delete(id);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar medição:', error);
    }
  };

  const handleDeleteSensor = async (id) => {
    try {
      await sensorService.delete(id);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar sensor:', error);
    }
  };

  const handleDeleteContainer = async (id) => {
    try {
      await containerService.delete(id);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar container:', error);
    }
  };

  const getSensorIcon = (sensorName) => {
    const name = sensorName?.toLowerCase() || '';
    if (name.includes('temperatura')) return <Thermometer size={20} />;
    if (name.includes('umidade')) return <Droplet size={20} />;
    return <Activity size={20} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="dados-loading">
        <RefreshCw className="loading-spinner" />
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dados">
      <div className="container">
        <div className="dados-header">
          <h1>
            <BarChart3 size={32} />
            Dados de Monitoramento
          </h1>
          <p>Visualize e gerencie os dados coletados pelos sensores de compostagem</p>
          <button onClick={fetchData} className="refresh-btn">
            <RefreshCw size={20} />
            Atualizar
          </button>
        </div>

        <div className="dados-tabs">
          <button
            className={`tab ${activeTab === 'measures' ? 'active' : ''}`}
            onClick={() => setActiveTab('measures')}
          >
            Medições ({measures.length})
          </button>
          <button
            className={`tab ${activeTab === 'sensors' ? 'active' : ''}`}
            onClick={() => setActiveTab('sensors')}
          >
            Sensores ({sensors.length})
          </button>
          <button
            className={`tab ${activeTab === 'containers' ? 'active' : ''}`}
            onClick={() => setActiveTab('containers')}
          >
            Containers ({containers.length})
          </button>
        </div>

        {/* Tab Medições */}
        {activeTab === 'measures' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Nova Medição</h3>
              <form onSubmit={handleCreateMeasure} className="data-form">
                <input
                  type="number"
                  placeholder="Valor"
                  value={newMeasure.value}
                  onChange={(e) => setNewMeasure({...newMeasure, value: e.target.value})}
                  required
                />
                <input
                  type="datetime-local"
                  value={newMeasure.dtMeasure}
                  onChange={(e) => setNewMeasure({...newMeasure, dtMeasure: e.target.value})}
                  required
                />
                <select
                  value={newMeasure.sensorId}
                  onChange={(e) => setNewMeasure({...newMeasure, sensorId: e.target.value})}
                  required
                >
                  <option value="">Selecione um sensor</option>
                  {sensors.map(sensor => (
                    <option key={sensor.id} value={sensor.id}>
                      {sensor.name} ({sensor.unit})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Container"
                  value={newMeasure.container}
                  onChange={(e) => setNewMeasure({...newMeasure, container: e.target.value})}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  Adicionar Medição
                </button>
              </form>
            </div>

            <div className="data-grid">
              {measures.map(measure => (
                <div key={measure.id} className="data-card">
                  <div className="card-header">
                    {getSensorIcon(measure.sensor?.name)}
                    <h4>{measure.sensor?.name || 'Sensor Desconhecido'}</h4>
                    <button
                      onClick={() => handleDeleteMeasure(measure.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="measure-value">
                      {measure.value} {measure.sensor?.unit}
                    </div>
                    <div className="measure-info">
                      <p><strong>Data:</strong> {formatDate(measure.dtMeasure)}</p>
                      <p><strong>Container:</strong> {measure.container || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Sensores */}
        {activeTab === 'sensors' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Novo Sensor</h3>
              <form onSubmit={handleCreateSensor} className="data-form">
                <input
                  type="text"
                  placeholder="Nome do sensor"
                  value={newSensor.name}
                  onChange={(e) => setNewSensor({...newSensor, name: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Unidade (ex: °C, %, pH)"
                  value={newSensor.unit}
                  onChange={(e) => setNewSensor({...newSensor, unit: e.target.value})}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  Adicionar Sensor
                </button>
              </form>
            </div>

            <div className="data-grid">
              {sensors.map(sensor => (
                <div key={sensor.id} className="data-card">
                  <div className="card-header">
                    {getSensorIcon(sensor.name)}
                    <h4>{sensor.name}</h4>
                    <button
                      onClick={() => handleDeleteSensor(sensor.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="card-body">
                    <p><strong>Unidade:</strong> {sensor.unit}</p>
                    <p><strong>ID:</strong> {sensor.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Containers */}
        {activeTab === 'containers' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Novo Container</h3>
              <form onSubmit={handleCreateContainer} className="data-form">
                <input
                  type="text"
                  placeholder="Nome do container"
                  value={newContainer.name}
                  onChange={(e) => setNewContainer({...newContainer, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Peso (kg)"
                  value={newContainer.weigth}
                  onChange={(e) => setNewContainer({...newContainer, weigth: e.target.value})}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  Adicionar Container
                </button>
              </form>
            </div>

            <div className="data-grid">
              {containers.map(container => (
                <div key={container.id} className="data-card">
                  <div className="card-header">
                    <div className="container-icon">📦</div>
                    <h4>{container.name}</h4>
                    <button
                      onClick={() => handleDeleteContainer(container.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="card-body">
                    <p><strong>Peso:</strong> {container.weigth} kg</p>
                    <p><strong>Status:</strong> {container.valid ? 'Válido' : 'Inválido'}</p>
                    <p><strong>ID:</strong> {container.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dados; 