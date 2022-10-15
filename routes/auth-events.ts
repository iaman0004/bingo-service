import { IGameStart, IPlayerInit, IPlayerSocketInfo, IRoomInfo } from "interfaces/auth-interface";
import { ISentEvent } from "interfaces/event-interface";
import { generateRoomId } from "../services/socket-service";
import { Socket } from "socket.io/dist/socket"
import { IN_EVENT, OUT_EVENT } from '../constants/event-constants';

const _rooms: Map<string, IRoomInfo> = new Map();

module.exports = function(io: any) {
  io.on('connection', (socket: Socket) => {
    
    socket.on(IN_EVENT.JOIN_ROOM, (evt: IPlayerInit) => {
      console.log({evt});
      /**
       * When rooom exists
       */
      if (evt.room && _rooms.has(evt.room)) {
        /**
         * Player already exists
         */
        const playerExist = _rooms.get(evt.room)?.players?.some((_u: IPlayerSocketInfo) => _u.user === evt.user);
        if (playerExist) {
          const failedData: ISentEvent = {
            type: 'failed',
            data: {
              toast: `Failed to join room, player with ${evt.user} already exists`
            }
          }
          socket.emit(OUT_EVENT.RECEIVE_ROOM_ID, failedData);
          return;
        }

        const roomInfo: IRoomInfo | undefined = _rooms.get(evt.room);
        if (roomInfo) {
          /**
           * Room max limit reached : allowed 2 atmost per room
           */
          if (roomInfo.players.length >= 2) {
            const failedData: ISentEvent = {
              type: 'failed',
              data: {
                toast: `Room already full. Try joining another room`
              }
            }
            
            socket.emit(OUT_EVENT.RECEIVE_ROOM_ID, failedData);
            return;
          }
          
          const player: IPlayerSocketInfo = {
            user: evt.user,
            room: evt.room,
            socketId: socket.id,
            leader: false
          }
          roomInfo.players?.push(player);
          _rooms.set(evt.room, roomInfo);
          const succesData: ISentEvent = {
            type: 'success',
            data: {
              room: evt.room,
              user: evt.user,
              leader: false
            }
          }

          const opponentForCurrent = roomInfo.players.find((player: IPlayerSocketInfo) => player.user !== evt.user);

          socket.join(evt.room);
          socket.emit(OUT_EVENT.RECEIVE_ROOM_ID, succesData); //for same user

          /**
           * Opponent Joined Events
           */
          socket.broadcast.to(evt.room).emit(OUT_EVENT.OPPONENT_JOINED, succesData); //for other users
          
          succesData.data = {
            room: opponentForCurrent?.room,
            user: opponentForCurrent?.user,
            leader: opponentForCurrent?.leader
          };
          socket.emit(OUT_EVENT.OPPONENT_JOINED, succesData);
        }
        return;
      }

      /**
       * When room doesn't exists
       */
      console.log(io.sockets.adapter.rooms)
      const roomId = evt.room && evt.room.length ? evt.room : generateRoomId(io.sockets.adapter.rooms);
      const player: IPlayerSocketInfo = {
        user: evt.user,
        room: roomId,
        socketId: socket.id,
        leader: true
      }
      const roomInfo: IRoomInfo = {
        players: [player],
        gameStarted: false,
        room: roomId
      }
      _rooms.set(roomId, roomInfo);
      const succesData: ISentEvent = {
        type: 'success',
        data: {
          room: roomId,
          user: evt.user,
          leader: true
        }
      }
      socket.join(roomId);
      socket.emit(OUT_EVENT.RECEIVE_ROOM_ID, succesData);
    });

    /**
     * Start Game
     */
    socket.on(IN_EVENT.START_GAME, (evt: IGameStart) => {
      socket.broadcast.to(evt.room).emit(OUT_EVENT.START_GAME);
    });


    /**
     * Socket Disconnect handling
     */
    socket.on('disconnect', _evt => {
      let room: string;
      for (const _room of socket.rooms) {
        if (_room != socket.id) {
          room = _room;
          console.log(room);
          // break;
        }
      }

    })
  });
}