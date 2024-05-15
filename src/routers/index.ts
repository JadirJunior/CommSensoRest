import {Router} from 'express'
import sensorTypeRouter from './SensorTypeRouter'
import containerRouter from './ContainerRouter'
import MeasureRouter from './MeasureRouter'

const router = Router()

router.use(containerRouter)
router.use(sensorTypeRouter)
router.use(MeasureRouter)

export default router