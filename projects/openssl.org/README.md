# OpenSSL

## Configuration Files

- `/etc/ssl/openssl.cnf`
- `$OPENSSL_CONF`
- `$OPENSSL_HOME/openssl.cnf`

## CA Certificates

On macOS and Windows the system provides CAs.

On *nix, SSL certificates are provided by [curl.se/ca-certs]. OpenSSL and other
applications know where to find these via the `SSL_CERT_FILE` environment
variable.

You can override this, either by setting it yourself in which case it `pkgx`
will not override it, or by running programs _without_ ca-certs either by
disabling companions or removing it explicitly.

[curl.se/ca-certs]: https://pkgx.dev/pkgs/curl.se/ca-certs
