import {Router} from 'express'
import SensorTypeController from '../controllers/SensorTypeController';
import SensorTypeService from '../services/SensorTypeService';

const control = new SensorTypeController(new SensorTypeService())

const sensorTypeRouter = Router()

sensorTypeRouter.get('/sensores', control.getAll.bind(control));
sensorTypeRouter.post('/sensores', control.create.bind(control));
sensorTypeRouter.delete('/sensores/:id', control.deleteById.bind(control));
sensorTypeRouter.patch('/sensores/:id', control.updateById.bind(control));

export default sensorTypeRouter