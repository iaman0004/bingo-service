import { IN_EVENT, OUT_EVENT } from "../constants/event-constants";

module.exports = function(io: any) {
  io.on('connection', (socket: any) => {
    socket.on(IN_EVENT.PLAYED, (evt: any) => {
      console.log(socket.rooms);
      socket.rooms.forEach((_room: string) => {
        if (_room !== socket.id) {
          console.log(evt);
          socket.to(_room).emit(OUT_EVENT.OPPONENT_PLAYED, evt);
        }
      })
    })
  });
}