const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fname: { type: DataTypes.STRING(50), allowNull: false },
  lname: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  car_id: { type: DataTypes.INTEGER, allowNull: true },
  role: { type: DataTypes.STRING(20), defaultValue: 'user' }
}, {
  tableName: 'Users',
  timestamps: false
});

module.exports = User;
