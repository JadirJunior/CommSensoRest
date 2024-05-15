import {Router} from 'express'
import ContainerController from '../controllers/ContainerController';
import ContainerService from '../services/ContainerService';

const control = new ContainerController(new ContainerService())

const containerRouter = Router()

containerRouter.get('/container', control.getAll.bind(control));
containerRouter.post('/container', control.create.bind(control));
containerRouter.delete('/container/:id', control.deleteById.bind(control));
containerRouter.patch('/container/:id', control.updateById.bind(control));

export default containerRouter