const Transport = require('winston-transport');
const NablaTx = require("mt-nabla-tx");


module.exports = class NablaTransport extends Transport {
  /**
 * Constructor function for the Nabla transport object responsible for
 * persisting log messages and metadata to a Nabla Node.
 * @param {!Object} [options={}] - Options for this instance.
 */
  constructor(options = {}) {
    super(options);

    this.options = options;
    this.nablaId = options?.nablaId || "apiLog";
    this.hostname = options?.hostname;
    this.siteName = options?.siteName;
    this.port = options?.port;
    if (!this.port) {
      this.port = 41234;
    }
    this.nablaTx = new NablaTx({ logger: null, port: this.port });
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    this._tx(info);

    callback();
  }


  _tx(info) {
    const payload = this._createTxPayload(info);
    this.nablaTx.nablaClient.clientSend(payload);
  }

  _createTxPayload(info) {
    return {
      nablaId: this.nablaId,
      siteName: this.siteName,
      hostname: this.hostname,
      level: this._getLevel(info),
      log: info.message
    }
  }

  _getLevel(info) {
    if (info.level.includes('info')) return "info"
    if (info.level.includes('warn')) return "warn"
    if (info.level.includes("error")) return "error"
  }
};