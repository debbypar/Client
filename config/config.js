

var config = {
    port: 6603, // Porta di ascolto del server
    ip: '0.0.0.0', // Preleva l'indirizzo ip della macchina
    randomGuidTime: 20000,
    //172.17.0.2
    //18.221.213.162
    // balancerIp: '34.195.19.72', // Ip statico del load balancer
    balancerIp: '172.17.0.2', // Ip statico del load balancer

    balancerPort: 6602, // Porta di ascolto del load balancer
    balancerSubPath: '/api/lb/edge/subscribe'
};

module.exports = config;
