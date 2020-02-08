#https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#running-on-alpine
FROM node:12.15.0-alpine
ENV ENV "docker"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /scr/
COPY . .
RUN apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont
RUN npm install --production
RUN npm run build
EXPOSE 4100 4200
CMD npm run start:prod