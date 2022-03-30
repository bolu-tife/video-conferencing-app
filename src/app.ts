import { Request, Response, Application } from 'express';
import express = require('express');

// import cors from 'cors';
// import { Server } from 'socket.io';
// import http from 'http';


const PORT = 8000;
const app: Application = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('User is connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

app.get('/', (_: Request, res: Response) => {
  res.send('Welcome to the Google Meet Clone!');
});

// app.get()

// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.listen(PORT, () => console.log('Listening on port: ' + PORT));
