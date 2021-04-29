var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
    context: '/api',
    // target: 'http://10.7.0.117:9096',
    target: 'http://192.168.3.110:5000',
    pathRewrite: { "^/api": "" },
    secure: false,
    changeOrigin: true
}, {
    context: '/cache',
    // target: 'http://10.7.0.117:9096',
    target: 'http://192.168.3.110:81',
    secure: false,
    changeOrigin: true,
    // pathRewrite: { "^/api": "" }
},
];

function setupForCorporateProxy() {
    // var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
    var proxyServer = "http://10.7.0.117:2379"
    if (proxyServer) {
        var agent = new HttpsProxyAgent(proxyServer);
        console.log('Using corporate proxy server: ' + proxyServer);
        proxyConfig.forEach(function (entry) {
            entry.agent = agent;
        });
    }
    return proxyConfig;
}
module.exports = proxyConfig
// module.exports = setupForCorporateProxy();