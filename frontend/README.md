# HOT TAKES #

## Installation ##

Here are the dependancies you need to install:
- NodeJS 12.14 or 14.0.
- Angular CLI 7.0.2.
- node-sass : make sure to use the corresponding version to NodeJS. For Noe 14.0 for instance, you need node-sass in version 4.14+.

On Windows, these installations require to use PowerShell in administrator mode.

The, clone this repo and run `npm install`.


## Usage ##

Run `npm start`. This should both run the local server and launch your browser.

If your browser fails to launch, or shows a 404 error, navigate your browser to http://localhost:8080.

The app should reload automatically when you make a change to a file.

Use `Ctrl+C` in the terminal to stop the local server.


## Commandes ##

UNINSTALL
npm uninstall -g @angular/cli && npm uninstall @angular/cli && rmdir /S node_modules && npm cache clean --force

INSTALL FRONT-END
npm install -g @angular/cli@7.0.2 && npm install @angular/cli@7.0.2
npm start

INSTALL BACK-END
npm install -g nodemon

npm install --save express && npm install --save body-parser
npm install --save mongoose
npm install --save mongoose-unique-validator --legacy-peer-deps
npm install --save bcrypt
npm install --save jsonwebtoken 
npm install --save multer

nodemon server