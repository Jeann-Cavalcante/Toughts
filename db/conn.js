const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso!.");
} catch (err) {
  console.log(`Erro ao se conectar: ${err}`);
}

module.exports = sequelize;
