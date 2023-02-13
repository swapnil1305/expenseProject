const Sequelize = require('sequelize');

const sequelize = new Sequelize ('expenseproject', 'root', 'swappnil@7', {
    dialect: 'mysql',
    host: 'localhost',
})

module.exports = sequelize;