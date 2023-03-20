// const http = require('https');
// const host = 'localhost';
// const port = 443;


// // const server = http.createServer((req, res) => {
// //     res.end('Voilà la réponse du serveur !');
// // });

// const requestListener = function (req, res) {
//     res.writeHead(200);
//     res.end("My first server!");
// };

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });

// 'use strict';

// const express = require('express');
// const app = express();
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
// app.listen(5000, () => console.log('Server is up and running'));

// const express = require('express')
// const app = express()
// const port = 5000
// const name = process.env.name || "World"

//     app.get('/', (req, res) => {
//         res.send(`Hello ${name} !`)
//     })
// app.listen(port, () => {
//     console.log(`Server Started on Port  ${port}`)
// })

const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.sendfile('/var/www/html')
})
app.listen(5000, () => console.log('Server is up and running'));