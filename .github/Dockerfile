FROM debian:buster-slim AS stage1
RUN apt-get update && apt-get install -y curl
RUN curl https://pkgx.sh/$(uname)/$(uname -m).tgz | tar xz -C /usr/local/bin
RUN pkgx +llvm.org +jq +xz +make +unzip +msgfmt +patchelf +file +deno^2 +msgfmt +bash +patch +autoconf +automake +pkg-config +perl +libtool +curl +bzip2 >/dev/null
COPY ./bin /work/bin
COPY ./brewkit /work/lib
COPY ./.github /work/.github
COPY ./deno.jsonc /work/deno.jsonc
RUN cd work && find -name \*.ts | xargs pkgx deno cache

FROM debian:buster-slim AS stage2
COPY --from=stage1 /usr/local/bin/pkgx /usr/local/bin/pkgx
COPY --from=stage1 /root/.pkgx /root/.pkgx
COPY --from=stage1 /root/.cache /root/.cache

# libc-dev: glibc is something we don’t yet pkg
# libgcc-8-dev: for crtbeginS.o which is needed to link things against glibc
RUN apt-get update && apt-get install libc6-dev libgcc-8-dev --yes
