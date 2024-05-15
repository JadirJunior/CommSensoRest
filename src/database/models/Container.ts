import {DataTypes, Model} from 'sequelize'
import db from '.'

class Container extends Model {
    declare id: number
    declare name: string
    declare quality: string
}

Container.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    quality: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'container',
    timestamps: false
})

export default Container