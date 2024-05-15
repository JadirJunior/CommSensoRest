import {DataTypes, Model} from 'sequelize'
import db from '.'
import Container from './Container'
import SensorType from './SensorType'


class Measure extends Model {
    //Use CamelCase to define the attributes
    declare id: number
    declare value: number
    declare dtMeasure: Date
    declare sensorId: number
    declare containerId: number
}


Measure.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    value: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },

    dtMeasure: {
        type: DataTypes.DATE,
        allowNull: false
    },

    sensorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },

    containerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    sequelize: db,
    tableName: 'measure',
    timestamps: false,
    underscored: true
})



//Relationship between Container and Measure
Measure.belongsTo(Container,{
    foreignKey: 'containerId',
    as: 'container'
});

Measure.belongsTo(SensorType,{
    foreignKey: 'sensorId',
    as: 'sensor'
});


export default Measure