# scr-gui
## Minimum `docker-compose.yml` configureation
	version: "3"
	services:
	scr:
		container_name: scr
		build: .
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