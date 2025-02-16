# `curl.se/ca-certs`

CA Certificates are required to securely connect via HTTPS (among other
things).

The cURL project assembles these CA Certificates via the Mozilla CA
certificate store into PEM format.

Apple and Microsoft manage their own CA stores, so on those platforms we
configure packages to use them.

On *nix we use this.
