import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { IRoomInfo } from 'interfaces';

const PORT = process.env.PORT || 9090;

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


export const _rooms: Map<string, IRoomInfo> = new Map();

require('./routes/auth-events')(io, _rooms);
require('./routes/bingo-events')(io, _rooms);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send({
    app: 'Working fine...!'
  });
});

httpServer.listen(PORT, () => {
  console.log(`Working Fine at ${PORT}`);
})