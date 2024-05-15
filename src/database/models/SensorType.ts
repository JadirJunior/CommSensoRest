import {DataTypes, Model} from 'sequelize'
import db from '.'

class SensorType extends Model {
    declare id: number
    declare name: string
}


SensorType.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },


    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'sensortype',
    timestamps: false
});

export default SensorType