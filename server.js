const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

const DEFAULT_PROTO = 'https';
const DEFAULT_PORT = 80;

// Configuration
const PORT = process.env.PORT || DEFAULT_PORT;

// Create an HTTP proxy server
const proxy = httpProxy.createProxyServer({
  agent: new http.Agent({
    checkServerIdentity: (host, cert) => undefined,
  }),
  changeOrigin: true,
});

// Handle errors in the proxy
proxy.on('error', (err, req, res) => {
  console.error(err);
  writeErr(res, 500, 'Proxying failed');
});

// Handle requests to the proxy
const handleRequest = (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const targetUrl = queryObject.url;

  if (!targetUrl) {
    writeErr(res, 400, 'Missing target URL parameter');
    return;
  }

  // Log the target URL for testing purposes
  console.log('Proxying request to:', targetUrl);

  // Proxy the request to the target URL
  proxy.web(req, res, { target: targetUrl });
};

// Create an HTTP server
const server = http.createServer(handleRequest);

// Listen on the specified port
server.listen(PORT, () => {
  console.log(`Proxy server started on port ${PORT}`);
});

// Utility function to write error response
function writeErr(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.end(message);
}
