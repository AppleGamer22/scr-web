# scr-gui
|Network|GitHub|Docker Hub|
|-|-|-|
|license|![GitHub](https://img.shields.io/github/license/AppleGamer22/scr-gui?logo=github)||
|relase|![GitHub release](https://img.shields.io/github/v/release/AppleGamer22/scr-gui?logo=Github)||
|downloads|![GitHub downloads](https://img.shields.io/github/downloads/AppleGamer22/scr-gui/total?&logo=github)|![Docker Pulls](https://img.shields.io/docker/pulls/applegamer22/scr-gui?label=downloads&logo=docker)|
|people|![GitHub contributors](https://img.shields.io/github/contributors/AppleGamer22/scr-gui?logo=github)||
|code size|![GitHub code size](https://img.shields.io/github/languages/code-size/AppleGamer22/scr-gui?logo=GitHub)|
|forks|![GitHub forks](https://img.shields.io/github/forks/AppleGamer22/scr-gui?logo=github)|
|stars|![GitHub stars](https://img.shields.io/github/stars/AppleGamer22/scr-gui?logo=github)|![Docker Stars](https://img.shields.io/docker/stars/applegamer22/scr-gui?label=stars&logo=docker)|
|watchers|![GitHub watchers](https://img.shields.io/github/watchers/AppleGamer22/scr-gui?logo=github)|
## Minimum `docker-compose.yml` configuration
	version: "3"
	services:
	scr:
		container_name: scr
		image: applegamer22/scr-gui:<version>
		environment:
		JWT_SECRET: some_private_key
		ports:
		- 4100:4100
		- 4200:4200
		- 7777:7777
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