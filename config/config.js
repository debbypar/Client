

var config = {
    port: 6603, // Porta di ascolto del server
    ip: '0.0.0.0', // Preleva l'indirizzo ip della macchina
    randomGuidTime: 10000,
    balancerIp: '172.17.0.2', // Ip statico del load balancer
    balancerPort: 6602, // Porta di ascolto del load balancer
    balancerSubPath: '/api/lb/edge/subscribe'
};

module.exports = config;
