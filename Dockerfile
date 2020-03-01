FROM node:12.16.0-alpine
ENV ENV "docker"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /scr/
RUN chown -R node:node /scr/
COPY . .
RUN apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont
USER node
RUN npm install --production
RUN npm run build
EXPOSE 4100 4200
CMD npm run start:prod
