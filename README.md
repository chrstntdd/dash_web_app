# Dash Analytics Web App

## Getting Started

**These instructions are only for the React front end of this web app.** 

1. Install dependencies

 ```
 $ yarn install
 or
 $ npm install
 ```
 
 2. Build and start development server
 
 ```
 $ node fuse.js
 ```
 
  This project uses [FuseBox](https://github.com/fuse-box/fuse-box) for bundling client side assets instead of the defacto standard, Webpack. Running the script below will compile all the code within the `client` directory out to `dist`, copy static assets to `dist`, start a server to serve all the compiled code, and open a browser tab with the application up and running. The development server is configured in watch mode with hot module reloading, so in theory the browser should reflect the changes made on save to any of the client side code.
