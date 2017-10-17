var slaveList = [];

exports.addSlave = addSlaveFn;

function addSlaveFn(ip) {
    slaveList.push({
        ipSlave: ip
    });
}

