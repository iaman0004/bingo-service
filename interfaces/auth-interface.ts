export interface IPlayerInit {
  user: string;
  room?: string;
}

export interface IGameStart {
  room: string;
}

export interface IPlayerSocketInfo {
  socketId: string;
  user: string;
  room: string;
  leader: boolean;
}

export interface IRoomInfo {
  room: string;
  players: Array<IPlayerSocketInfo>;
  gameStarted: boolean; 
}