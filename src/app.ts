import { Request, Response, Application } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { ExpressPeerServer } from 'peer';
import {generateRoomId} from "./helper/room";

const PORT = 8000;
const app: Application = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const peerServer = ExpressPeerServer(server, {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  debug: true,
});

app.use('/peerjs', peerServer);

app
  .get('/', (_: Request, res: Response) => {
    res.render('landing');
  })
  .post('/', (req: Request, res: Response) => {
    let room = req.params.room
   
    // if (!isRoomIdValid(room))
    //   room = generateRoomId()
    res.redirect(`/${room}`);
  });

app.get('/newRoom', (req: Request, res: Response) => {
  const roomId = generateRoomId()
  res.redirect(`/${roomId}`);
});

app.get('/thankyou', (req: Request, res: Response) => {
  console.log(req.query.room );
  
  res.render('leaveMeeting', { roomId: req.query.room });
});

app.get('/:room', (req: Request, res: Response) => {
  let room = req.params.room
  
  res.render('room', { roomId: room });
  

});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    console.log('Connected');
    socket.join(roomId);

    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message);
    });
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
