const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

const DEFAULT_PROTO = 'https';
const DEFAULT_USER_AGENT = 'Mozilla';
const DEFAULT_PORT = 80;
const DEFAULT_ALLOWED_GZIP = 'transform,decode,append';
const DEFAULT_WHITELIST = false;
const DEFAULT_OVERRIDE = false;
const DEFAULT_REWRITE_GZIP = false;
const DEFAULT_APPEND_HEADER = false;

const ALLOWED_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE'];
const ALLOWED_PROTOS = ['http', 'https'];
const ALLOWED_GZIP_METHODS = ['transform', 'decode', 'append'];

// Configuration
const PORT = process.env.PORT || DEFAULT_PORT;
const ACCESS_KEY = process.env.ACCESS_KEY;
const USE_WHITELIST = process.env.USE_WHITELIST === 'true';
const USE_OVERRIDE_STATUS = process.env.USE_OVERRIDE_STATUS === 'true';
const REWRITE_ACCEPT_ENCODING = process.env.REWRITE_ACCEPT_ENCODING === 'true';
const APPEND_HEAD = process.env.APPEND_HEAD === 'true';
const ALLOWED_HOSTS = getEnvHosts(process.env.ALLOWED_HOSTS, DEFAULT_PROTO);
const GZIP_METHOD = process.env.GZIP_METHOD || DEFAULT_GZIP_METHOD;

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
  // Your logic for handling requests goes here
};

// Create an HTTP server
const server = http.createServer(handleRequest);

// Listen on the specified port
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Utility function to write error response
const writeErr = (res, status, message) => {
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.end(message);
};

// Utility function to parse hosts from environment variable
function getEnvHosts(env, defaultProto) {
  if (!env) {
    return [];
  }

  const hosts = env.split(',');
  const parsed = [];

  for (const host of hosts) {
    try {
      parsed.push(new URL(`${defaultProto}://${host}`));
    } catch (e) {
      throw new Error(`Configuration error! Invalid host domain on item ${host}`);
    }
  }

  return parsed;
}
