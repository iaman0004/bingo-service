export const IN_EVENT = {
  JOIN_ROOM: 'join_room',
  BROADCAST_MESSAGE: 'client_to_server_message',
  PLAYED: 'played',
  START_GAME: 'start_game',
  GAME_WON: 'game_won',
  ANOTHER_GAME: 'another_game'
}

export const OUT_EVENT = {
  RECEIVE_ROOM_ID: 'receive_room_id',
  RECEIVE_MESSAGE: 'server_to_client_message',
  OPPONENT_PLAYED: 'opponent_played',
  OPPONENT_JOINED: 'opponent_joined',
  OPPONENT_LEFT: 'opponent_left',
  START_GAME: 'start_game',
  NEXT_TURN: 'next_turn',
  OPPONENT_WON: 'opponent_won',
  ANOTHER_GAME: 'another_game'
}