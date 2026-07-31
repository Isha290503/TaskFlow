const dns = require("dns").promises;

dns.resolveSrv("_mongodb._tcp.cluster0.uo9vd7l.mongodb.net")
  .then(console.log)
  .catch(console.error);