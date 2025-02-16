# OpenSSL

## Configuration Files

- `/etc/ssl/openssl.cnf`
- `$OPENSSL_CONF`
- `$OPENSSL_HOME/openssl.cnf`

## CA Certificates

- On macOS and Windows the system provides Certificate Authorities.
- On *nix, CA certificates are provided by [curl.se/ca-certs].

We build OpenSSL with the following search path:

- The `SSL_CERT_FILE` environment variable
- `$PREFIX/share/ca-certs.pem`
- `/etc/ssl/cert.pem`

Programs that use OpenSSL will find the CA Certificates automatically.

If for some reason a program does not, you can usually configure it with an
environment variable or the default lookup is usually `/etc/ssl/cert.pem` so
you could copy the certs there.

`pkgx` will set `SSL_CERT_FILE` automatically when invoked. You can override
this, either by setting it yourself in which case it `pkgx`, or by running
programs _without_ ca-certs either by disabling companions or removing it
explicitly.

[curl.se/ca-certs]: https://pkgx.dev/pkgs/curl.se/ca-certs
