import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Socket } from 'socket.io/dist/socket';
import cors from 'cors';
import { IN_EVENT} from './constants/event-constants';

const PORT: number = 9090;

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  },
  path: '/play/'
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  maxAge: 36000
}))

app.use(require('./routes/auth-route'));
require('./routes/auth-evnents')(io);
require('./routes/bingo-events')(io);

io.on('connection', (socket: Socket) => {
  console.log(socket.id);

  socket.on('disconnect', (evt) => {``
    console.log(evt);
  })

  // socket.on(IN_EVENT.JOIN_ROOM, (roomName: string) => {
  //   console.log(roomName);
  //   socket.join(roomName);
  //   console.log(socket.rooms);
  // });

  socket.on('client_to_server_message', (evt: any) => {
    socket.rooms.forEach((_room: string) => {
      if (_room !== socket.id) {
        console.log(evt);
        socket.to(_room).emit('server_to_client_message', evt);
      }
    })
  })
})

app.get('/', (_req: Request, res: Response) => {
  console.log('x');
  res.status(200).send({
    app: 'Socket.io',
    status: 'Fine'
  });
});

httpServer.listen(PORT, () => {
  console.log(`Working Fine at ${PORT}`);
})