export interface IPlayerTurn {
  
}

export interface IGameStart {
  room: string;
}

export interface IOpponentPlayed {
  room: string;
  played: number | string;
}