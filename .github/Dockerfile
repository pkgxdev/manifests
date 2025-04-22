FROM debian:buster-slim AS stage1
RUN apt-get update && apt-get install -y curl
RUN curl https://pkgx.sh/$(uname)/$(uname -m).tgz | tar xz -C /usr/local/bin

ENV PKGX_DIST_URL="https://dist.pkgx.dev/v2"
RUN pkgx +llvm.org +patchelf +deno^2 +gnu.org/gcc/libstdcxx^14
COPY ./brewkit /work/brewkit
COPY ./.github /work/.github
COPY ./deno.jsonc /work/deno.jsonc
COPY ./deno.lock /work/deno.lock
RUN cd /work && find ./brewkit -name \*.ts | xargs pkgx deno cache
RUN pkgx deno cache /work/.github/scripts/generate-versions

RUN apt-get install libgcc-8-dev --yes

RUN dpkg -L libgcc-8-dev | \
      while read -r file; do \
        case "$file" in \
        /usr/include/*|/usr/lib/*|/lib/*) [ -f "$file" ] && echo "$file" | tee;; \
        esac; \
      done > files.txt

# we still need glibc for the pkgx ecosystem
# linux headers are generally needed but we should provide
# pkgx statically links libgcc, however we do not use libgcc as a dependency
# in general yet because it is too painful
# RUN apt-get install --yes libc6-dev linux-libc-dev libgcc-8-dev libgcc1
# RUN dpkg -L libc6-dev linux-libc-dev libgcc-8-dev libgcc1 | \
#       while read -r file; do \
#         case "$file" in \
#         /usr/include/*|/usr/lib/*|/lib/*) [ -f "$file" ] && echo "$file";; \
#         esac; \
#       done > files.txt

# RUN echo /usr/bin/ldd >> files.txt
# RUN echo /usr/bin/env >> files.txt
# RUN echo /lib/x86_64-linux-gnu/librt.so.1 >> files.txt; \
#     echo /lib/x86_64-linux-gnu/librt-2.28.so >> files.txt
# RUN echo /lib/x86_64-linux-gnu/libdl.so.2 >> files.txt; \
#     echo /lib/x86_64-linux-gnu/libdl-2.28.so >> files.txt
# RUN echo /bin/bash >> files.txt

# # bash needs libtinfo sadly
# #TODO use our own bash
# RUN echo /lib/x86_64-linux-gnu/libtinfo.so.6.1 >> files.txt; \
#     echo /lib/x86_64-linux-gnu/libtinfo.so.6 >> files.txt

RUN tar czf /root/base.tgz -T files.txt


#TODO we need a real bash for `ldd` which apparently is a bash script
# symlinking /bin/sh doesn’t work


# we want a tiny image with the right glibc, busybox works for now
FROM debian:buster-slim AS stage2
COPY --from=stage1 /usr/local/bin/pkgx /usr/bin/pkgx
COPY --from=stage1 /root/.pkgx /root/.pkgx
COPY --from=stage1 /root/.cache/deno /root/.cache/deno
COPY --from=stage1 /root/base.tgz /root/base.tgz

RUN apt-get update && \
  apt-get install --yes libc6-dev linux-libc-dev libgcc-8-dev libgcc1 && \
  echo "Yes, do as I say!" | apt-get remove libstdc++6 libncursesw6 ncurses-base ncurses-bin

# restore libgcc-8-dev
RUN tar xzf /root/base.tgz -C / && rm /root/base.tgz

ENV PKGX_DIST_URL="https://dist.pkgx.dev/v2"
