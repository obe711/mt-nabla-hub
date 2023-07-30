const config = require("../config/config");
const NablaTx = require("mt-nabla-tx");


const nablaTx = new NablaTx({ logger: null, port: config.nablaPort });

const sendNablaError = (user, code, message) => {
  const nabla = {
    nablaId: "nablaError",
    nablaError: {
      user,
      code,
      message,
      hostname: config.nablaSiteName
    }
  }
  nablaTx.nablaClient.clientSend(nabla)
}

module.exports = {
  sendNablaError
}