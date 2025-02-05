FROM debian:buster-slim AS stage1
RUN apt-get update && apt-get install -y curl
RUN curl https://pkgx.sh/$(uname)/$(uname -m).tgz | tar xz -C /usr/local/bin
ENV PKGX_DIST_URL="https://dist.pkgx.dev/v2"
RUN pkgx +llvm.org +jq +make +patchelf +deno^2 >/dev/null
COPY ./brewkit /work/brewkit
COPY ./deno.jsonc /work/deno.jsonc
COPY ./deno.lock /work/deno.lock
RUN cd /work && find ./brewkit -name \*.ts | xargs pkgx deno cache

FROM debian:buster-slim AS stage2
COPY --from=stage1 /usr/local/bin/pkgx /usr/local/bin/pkgx
COPY --from=stage1 /root/.pkgx /root/.pkgx
COPY --from=stage1 /root/.cache/deno /root/.cache/deno

# libc6-dev: platform specific c-headers that LLVM doesn’t provide
# libgcc-8-dev: provides the c runtime `crtbeginS.o`
# libstdc++-8-dev: or we can’t build c++ pkgs
RUN apt-get update && apt-get install --yes libc6-dev libgcc-8-dev libstdc++-8-dev

ENV PKGX_DIST_URL="https://dist.pkgx.dev/v2"
