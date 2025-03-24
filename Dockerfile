FROM archlinux:latest

RUN pacman-key --init && \
    pacman-key --populate && \
    pacman -Syu --noconfirm && \
    pacman -S archlinux-keyring --noconfirm && \
    pacman -S npm nodejs --noconfirm

COPY . .

RUN npm i --force && \
    npm run build && \
    rm -rf node_modules/

EXPOSE 3000

ENV PORT=3000

CMD npm run start