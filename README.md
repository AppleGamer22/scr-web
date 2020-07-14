# scr-web
|Network|GitHub|Docker Hub|
|-|-|-|
|license|![GitHub](https://img.shields.io/github/license/AppleGamer22/scr-web?logo=github)||
|relase|![GitHub release](https://img.shields.io/github/v/release/AppleGamer22/scr-web?logo=Github)||
|build status|![publish-image](https://github.com/AppleGamer22/scr-web/workflows/publish-image/badge.svg)||
|downloads|![GitHub downloads](https://img.shields.io/github/downloads/AppleGamer22/scr-web/total?&logo=github)|![Docker Pulls](https://img.shields.io/docker/pulls/applegamer22/scr-web?label=downloads&logo=docker)|
|people|![GitHub contributors](https://img.shields.io/github/contributors/AppleGamer22/scr-web?logo=github)||
|code size|![GitHub code size](https://img.shields.io/github/languages/code-size/AppleGamer22/scr-web?logo=GitHub)|
|forks|![GitHub forks](https://img.shields.io/github/forks/AppleGamer22/scr-web?logo=github)|
|stars|![GitHub stars](https://img.shields.io/github/stars/AppleGamer22/scr-web?logo=github)|![Docker Stars](https://img.shields.io/docker/stars/applegamer22/scr-web?label=stars&logo=docker)|
|watchers|![GitHub watchers](https://img.shields.io/github/watchers/AppleGamer22/scr-web?logo=github)|
## Usage Responsibilities
* You should use this software with responsibility and with accordance to [Instagram's terms of use](https://help.instagram.com/581066165581870):
> * **You can't attempt to create accounts or access or collect information in unauthorized ways.**
> This includes creating accounts or collecting information in an automated way without our express permission.
* You should use this software with responsibility and with accordance to [TikTok's terms of use](https://www.tiktok.com/legal/terms-of-use):
> You may not:
> * use automated scripts to collect information from or otherwise interact with the Services;
* You should use this software with responsibility and with accordance to [VSCO's terms of use](https://vsco.co/about/terms_of_use):
> **C Service Rules**  
> You agree not to engage in any of the following prohibited activities:
> * **(I)** copying, distributing, or disclosing any part of the Service in any medium, including without limitation by any automated or non-automated “scraping”,
> * **(II)** using any automated system, including without limitation “robots,” “spiders,” “offline readers,” etc., to access the Service in a manner that sends more request messages to the VSCO servers than a human can reasonably produce in the same period of time by using a conventional on-line web browser (except that VSCO grants the operators of public search engines revocable permission to use spiders to copy materials from vsco.co for the sole purpose of and solely to the extent necessary for creating publicly available searchable indices of the materials but not caches or archives of such materials),
> * **(XI)** accessing any content on the Service through any technology or means other than those provided or authorized by the Service,
> * **(XII)** bypassing the measures we may use to prevent or restrict access to the Service, including without limitation features that prevent or restrict use or copying of any content or enforce limitations on use of the Service or the content therein.
## Set-up
1. Create a `docker-compose.yml` file:
```yml
  version: "3"
  services:
    scr:
      container_name: scr
      image: applegamer22/scr-web:<version>
      environment:
        JWT_SECRET: <some_private_key>
        DATABASE_URL: mongodb://<some_database_location>:27017/<some_database>
      ports:
        - <available_port>:4100
      volumes:
        - ./some_local_directory:/scr/users
    database:
      container_name: database
      image: mongo:4.2.0
      restart: always
      volumes:
        - ./database:/data/db
      ports:
        - 27017:27017
```
2. Run `docker-compose up --build` in your command prompt.
3. Load the web interface from `http://localhost:4200/`.
4. Sign-up with your social network credentials (To be stored in your MongoDB instance).
5. Sign-in with your social network credentials.
## Generating icon assets
1. Get [Ionicons Tool SVG File](https://ionicons.com/ionicons/svg/md-hammer.svg).
2. Go to [online SVG editor](https://editor.method.ac):
   1. Colour shape #0cd1e8.
   2. Download modified SVG file.
3. Use [online image resizer](https://pinetools.com/resize-image).
   1. Export to PNG.
4. Use [online image type converter](https://lottatools.com/convert-to-ico) to get ICO files.
5. Use [online image background colouriser](https://lottatools.com/add-solid-background-to-image):
   1. to change icon-192x192.png to white.
   2. rename to icon-ios-192x192.png
