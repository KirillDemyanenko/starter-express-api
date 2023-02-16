import ComputerPlayer from './computer-player';
import Player from './player';
import WebSocket from 'ws';
import UnoGame from './uno-game';

export interface CardInfo {
  id: number,
  color: string,
  value: number
}

export interface Players {
  player: Player | ComputerPlayer | null;
}

export interface Client {
  socket: WebSocket;
  userName: string;
}

export interface WebSocketMessage {
  action: string,
  data: string
}

export interface Game {
  id: number,
  game: UnoGame
}

export interface CreateGameMessage {
  players: number,
  online: boolean
}

export interface DBUsers {
  UserId: number,
  UserName: string,
  UserPassword: string,
  Email: string
}

export interface UserInfo {
  userName: string,
  password: string,
  email: string
}
