FROM pkgxdev/pkgx:latest as stage0
RUN pkgx +llvm.org +jq +xz +make +unzip +msgfmt +patchelf +file +deno^2 +bash +patch +autoconf +automake +pkg-config +perl +libtool +curl >/dev/null
COPY ./bin /work/bin
COPY ./lib /work/lib
COPY ./deno.jsonc /work/deno.jsonc
RUN cd /work && pkgx deno cache bin/private/deps-env.ts lib/*.ts

FROM pkgxdev/pkgx:latest as stage1
COPY --from=stage0 /root/.pkgx /root/.pkgx
COPY --from=stage0 /root/.cache /root/.cache
