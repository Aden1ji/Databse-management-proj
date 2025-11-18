const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cars = sequelize.define('Cars', {
    car_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    brand: { type: DataTypes.STRING(50), allowNull: false },
    model: { type: DataTypes.STRING(50), allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: true }
}, {
    tableName: 'Cars',
    timestamps: false
});

module.exports = Cars;
