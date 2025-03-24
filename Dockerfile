FROM archlinux:latest

WORKDIR /app

RUN pacman-key --init && \
    pacman-key --populate && \
    pacman -Syu --noconfirm && \
    pacman -S archlinux-keyring --noconfirm && \
    pacman -S npm nodejs --noconfirm

COPY . .

RUN npm i -f && \
    npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD npm run start
