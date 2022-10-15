export const IN_EVENT = {
  JOIN_ROOM: 'join_room',
  BROADCAST_MESSAGE: 'client_to_server_message',
  PLAYED: 'played',
  START_GAME: 'start_game'
}

export const OUT_EVENT = {
  RECEIVE_ROOM_ID: 'receive_room_id',
  RECEIVE_MESSAGE: 'server_to_client_message',
  OPPONENT_PLAYED: 'opponent_played',
  OPPONENT_JOINED: 'opponent_joined',
  OPPONENT_LEFT: 'opponent_left',
  START_GAME: 'start_game'
}