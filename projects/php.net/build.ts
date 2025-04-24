import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps }: BuildOptions) {
  await unarchive(`https://www.php.net/distributions/php-${version}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --enable-bcmath
        --enable-calendar
        --enable-dba
        --enable-exif
        --enable-ftp
        --enable-fpm
        --enable-gd
        --enable-intl
        --enable-mbregex
        --enable-mbstring
        --enable-mysqlnd
        --enable-pcntl
        --enable-phpdbg
        --enable-phpdbg-readline
        --enable-shmop
        --enable-soap
        --enable-sockets
        --enable-sysvmsg
        --enable-sysvsem
        --enable-sysvshm
        --with-pear
        --with-curl
        --with-external-pcre
        --with-ffi
        --with-gettext=${deps['gnu.org/gettext'].prefix}
        --with-gmp=${deps['gnu.org/gmp'].prefix}
        --with-iconv=${deps['gnu.org/libiconv'].prefix}
        --with-ldap=${deps['openldap.org'].prefix}
        --with-kerberos
        --with-layout=GNU
        --with-libxml
        --with-libedit
        --with-openssl
        --with-pdo-sqlite
        --with-pic
        --with-jpeg
        --with-sodium
        --with-sqlite3
        --with-xsl
        --with-webp
        --with-zip
        --with-zlib
        --disable-dtrace
        --without-ldap-sasl
        --without-ndbm
        --without-gdbm`;
  run`make install`
}