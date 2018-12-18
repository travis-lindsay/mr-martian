# mr-martian

A typescript-based, riveting game of adventure and survival.

##### Building the Code
- Download or fork the repository
- Install Node (https://nodejs.org/en/download/)
- Install the projects dependencies by running in your terminal
```sh
> npm install
```
- This installs typescript support, and webpack, along with all the other dependencies the code uses such as Vue JS, Jquery, Bootstrap, etc.
- For development, start up the webpack dev server by running
```sh
> npm run start
```
- With the server running any changes you make to the typescript files (.ts) will 'hot reload' and get automatically compiled into a lovely little javascript bundle which is used by the application.
- To make a production build, (like if you want to throw this on your own website), just run 
```sh
> npm run build
```
- This will run webpack and compile all the typescript files into a single app.js file located in 'dist/app.js'. Which you can then use for your production build that you throw on your web server.

#### Not necessary but recommended tools for development

- **IDE**: Visual Studio Code, mainly because it is much lighter weight than Visual Studio, and comes with support for typescript, javascript, and many other web technologies with the install of a few plugins.
- **Plugins**: I would also recommend installing both the 'Prettier', and 'vs-code-icons' plugins

#### Questions
- Just ask Travis, Jared, or Derek