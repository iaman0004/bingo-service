import { defineNextTurn } from "../services/bingo-service";
import { IN_EVENT, OUT_EVENT } from "../constants/event-constants";
import { IGameStart, IOpponentPlayed, IRoomInfo, ISentEvent } from "interfaces";

module.exports = function(io: any, roomsCreated: Map<string, IRoomInfo>) {
  io.on('connection', (socket: any) => {
    /**
     * Start Game
     */
     socket.on(IN_EVENT.START_GAME, (evt: IGameStart) => {
      const toStart = roomsCreated.get(evt.room);
      if (toStart) {
        socket.broadcast.to(evt.room).emit(OUT_EVENT.START_GAME);
      
        const playerIds: Array<string> = Array.from(toStart.players, player => player.socketId);
        
        const nextTurn = defineNextTurn(playerIds);
        io.to(nextTurn.willplay).emit(OUT_EVENT.NEXT_TURN);
        
        toStart.gameStarted = true;
        toStart.turn = nextTurn.players;
        roomsCreated.set(evt.room, toStart);
      }
    });

    /**
     * Gameplay
     */
    socket.on(IN_EVENT.PLAYED, (evt: IOpponentPlayed) => {
      const nextTurnRoom = roomsCreated.get(evt.room);

      console.log(evt);

      const played: ISentEvent = {
        type: 'success',
        data: {
          play: evt.played
        }
      };

      if (nextTurnRoom?.turn) {
        
        const nextTurn = defineNextTurn(nextTurnRoom.turn);
        io.to(nextTurn.willplay).emit(OUT_EVENT.OPPONENT_PLAYED, played);
        io.to(nextTurn.willplay).emit(OUT_EVENT.NEXT_TURN);

        nextTurnRoom.turn = nextTurn.players;
        roomsCreated.set(evt.room, nextTurnRoom);
      }
    })
  });
}