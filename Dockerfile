FROM node:12.16.1-alpine
ENV ENV "docker"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /scr/
COPY . .
RUN apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont
RUN npm install --production
RUN npm run build
RUN chown -R node:node .
USER node
EXPOSE 4100 4200
CMD npm run start:prod