

var config = {
    port: 6603, // Porta di ascolto del server
    ip: '0.0.0.0', // Preleva l'indirizzo ip della macchina
    randomGuidTime: 20000,
    balancerIp: '34.206.63.183', // Ip statico del load balancer
    balancerPort: 6602, // Porta di ascolto del load balancer
    balancerSubPath: '/api/lb/edge/subscribe'
};

module.exports = config;
