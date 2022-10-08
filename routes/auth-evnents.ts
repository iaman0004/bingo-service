import { IPlayerInit, IPlayerSocketInfo, IRoomInfo } from "interfaces/auth-interface";
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

        const player: IPlayerSocketInfo = {
          user: evt.user,
          room: evt.room,
          socketId: socket.id
        }
        const roomInfo: IRoomInfo | undefined = _rooms.get(evt.room);
        if (roomInfo) {
          roomInfo.players?.push(player);
          _rooms.set(evt.room, roomInfo);
        }
        const succesData: ISentEvent = {
          type: 'success',
          data: {
            room: evt.room
          }
        }
        socket.join(evt.room);
        socket.emit(OUT_EVENT.RECEIVE_ROOM_ID, succesData);
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
        socketId: socket.id
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
          room: roomId
        }
      }
      socket.join(roomId);
      socket.emit(OUT_EVENT.RECEIVE_ROOM_ID, succesData);
    });

    /**
     * 
     */
  });
}