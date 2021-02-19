FROM node:14.15.4-alpine
ENV ENV "docker"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /scr/
COPY . .
RUN apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont
RUN chown -R node:node .
RUN npm install --production
RUN npm run build
RUN rm -rf apps libs tools
USER node
EXPOSE 4100
CMD npm run start:prod