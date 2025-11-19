Steps for create your project repository And install Express JS :
1.Create a repository       => DEVTINDER
2.Initialize the repository => npm init 
It will ask you a few questions:
Package name  => Choose a name for your package.
Description   => You can write anything you want.
Entry point   => Dont touch it (leave as default).
Test command  => We wont worry about this now.
Keywords      => You can add keywords like nodejs , backend .
Author        => Write your name (e.g., Aravind Kumar).
3.create a folder called src.
4.Inside it, create a file named app.js.
5.run this file       => node src/app.js
6.Install Express.js. => npm i express
Express.js => minimalist and flexible web application framework for Node.js.
7.Start our server.
8.Install nodemod => npm i nodemon -g
   => Its automatically refresh the server if we make any changes.
-g =>  installs it globally
9.Add this package.json file.
 "scripts": {
    "start": "node src/app.js",
    "dev":"nodemon src/app.js"
  },
npm run start
npm run dev