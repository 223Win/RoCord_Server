package main

import (
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

const (
	DefaultProto        = "https"
	DefaultUserAgent    = "Mozilla"
	DefaultGzipMethod   = "transform"
	DefaultPort         = "80"
	DefaultAllowedGzip  = "transform,decode,append"
	AllowedMethods      = "GET,HEAD,POST,PUT,PATCH,DELETE,CONNECT,OPTIONS,TRACE"
	DefaultWhitelist    = false
	DefaultOverride     = false
	DefaultRewriteGzip  = false
	DefaultAppendHeader = false
)

var (
	AllowedProtos    = []string{"http", "https"}
	AllowedGzip      = []string{"transform", "decode", "append"}
	AllowedMethodsGo = []string{"GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "CONNECT", "OPTIONS", "TRACE"}
)

// Configuration
var (
	Port              = getEnv("PORT", DefaultPort)
	AccessKey         = getEnv("ACCESS_KEY", "")
	UseWhitelist      = getEnvBool("USE_WHITELIST", DefaultWhitelist)
	UseOverrideStatus = getEnvBool("USE_OVERRIDE_STATUS", DefaultOverride)
	RewriteAcceptGzip = getEnvBool("REWRITE_ACCEPT_ENCODING", DefaultRewriteGzip)
	AppendHead        = getEnvBool("APPEND_HEAD", DefaultAppendHeader)
	AllowedHosts      = getEnvHosts("ALLOWED_HOSTS", DefaultProto)
	GzipMethod        = getEnv("GZIP_METHOD", DefaultGzipMethod)
)

// getEnv retrieves an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// getEnvBool retrieves a boolean environment variable or returns a default value
func getEnvBool(key string, defaultValue bool) bool {
	if value, exists := os.LookupEnv(key); exists {
		return value == "true"
	}
	return defaultValue
}

// getEnvHosts retrieves a list of hosts from an environment variable
func getEnvHosts(key, defaultProto string) []*url.URL {
	if value, exists := os.LookupEnv(key); exists {
		hosts := []string{}
		parsed := []*url.URL{}
		for _, host := range hosts {
			u, err := url.Parse(fmt.Sprintf("%s://%s", defaultProto, host))
			if err != nil {
				panic(fmt.Sprintf("Configuration error! Invalid host domain on item %s", host))
			}
			parsed = append(parsed, u)
		}
		return parsed
	}
	return []*url.URL{}
}

func main() {
	server := http.NewServeMux()
	server.HandleFunc("/", handleRequest)
	fmt.Printf("Server started on port %s\n", Port)
	http.ListenAndServe(":"+Port, server)
}

func handleRequest(res http.ResponseWriter, req *http.Request) {
	// Your logic for handling requests goes here
}

func createReverseProxy(target *url.URL) *httputil.ReverseProxy {
	return httputil.NewSingleHostReverseProxy(target)
}

func parseTargetURL(targetStr string) (*url.URL, error) {
	return url.Parse(targetStr)
}
