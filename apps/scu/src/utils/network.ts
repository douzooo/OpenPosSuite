import os from 'os';

function ipToInt(ip: string) {
  return ip.split(".").reduce((a, o) => (a << 8) + Number(o), 0) >>> 0;
}

function intToIp(int: number) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

function getBroadcastAddress(ip: string, netmask: string) {
  return intToIp(ipToInt(ip) | (~ipToInt(netmask) >>> 0));
}


function getBroadcastTargets() {
  const interfaces = os.networkInterfaces();
  const targets = [];

  
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    
    for (const iface of ifaceList) {
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        iface.address &&
        iface.netmask
      ) {
        targets.push({
          interface: name,
          address: iface.address,
          broadcast: getBroadcastAddress(iface.address, iface.netmask),
        });
      }
    }
  }

  return targets;
}

const privateIp = () => {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
}

export default { privateIp, ipToInt, intToIp, getBroadcastAddress, getBroadcastTargets };
