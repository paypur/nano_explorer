FROM archlinux:latest

RUN pacman-key --init && \
    pacman-key --populate && \
    pacman -Syu --noconfirm && \
    pacman -S archlinux-keyring --noconfirm && \
    pacman -S npm nodejs --noconfirm

COPY . .

RUN npm i --force && \
    npm run build

CMD npm run start