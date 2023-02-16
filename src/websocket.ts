import WebSocket from 'ws';
import * as http from 'http';
import { Client, CreateGameMessage, Game, WebSocketMessage } from './game/types';
import UnoGame from './game/uno-game';
import chalk from 'chalk';

class WebsocketServer {
  private readonly ws: WebSocket.Server<WebSocket>;

  unregisteredUsersCounter: number;

  private clients: Client[] = [];

  private games: Game[] = [];

  constructor(port: number) {
    this.unregisteredUsersCounter = 0;
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      res.end('index.html');
    });
    this.ws = new WebSocket.Server({ server });
    server.listen(port, () => {
      console.log(chalk.bgCyan(`Listen port ${port}`));
    });
  }

  connectionOnClose(connection: WebSocket) {
    connection.on('close', () => {
      const client: Client = this.clients.filter(value => {
        return value.socket === connection;
      })[0];
      console.log(chalk.bgRedBright(`${client.userName} is disconnected!`));
      this.clients = this.clients.filter(value => {
        return value.socket !== connection;
      });
    });
  }

  findClient(connection: WebSocket): Client {
    return this.clients.filter(value => {
      return value.socket === connection;
    })[0];
  }

  connectionOnMessage(connection: WebSocket) {
    connection.on('message', (message) => {
      const msg = JSON.parse(message.toString()) as WebSocketMessage;
      switch (msg.action) {
        case 'CREATE_GAME': {
          const settings: CreateGameMessage = JSON.parse(msg.data) as CreateGameMessage;
          const newGame: Game = {
            id: this.games.length + 1,
            game: new UnoGame(settings.players, this.findClient(connection)),
          };
          this.games.push(newGame);
          newGame.game.startGame();
          break;
        }
        case 'WHATS_MY_NAME': {
          connection.send(JSON.stringify({ action: 'YOUR_NAME', data: this.findClient(connection).userName }));
          break;
        }
        case 'UPDATE_NAME': {
          this.clients.forEach(value => {
            if (value.socket === connection) {
              console.log(chalk.bgBlue(`User ${value.userName} update nickname on ${msg.data}`));
              value.userName = msg.data;
            }
          });
          break;
        }
        case 'CHAT_MESSAGE': {
          const date = new Date();
          const userSay = this.clients.filter(value => {
            return value.socket === connection;
          })[0].userName;
          this.clients.forEach(value => {
            value.socket.send(JSON.stringify(
              {
                action: 'INCOME_CHAT_MESSAGE',
                data: JSON.stringify(
                  {
                    user: userSay,
                    userMessage: msg.data,
                    time: `${date.getHours() < 10 ? '0'.concat(date.getHours().toString()) : date.getHours()}:${date.getMinutes() < 10 ? '0'.concat(date.getMinutes().toString()) : date.getMinutes()}:${date.getSeconds() < 10 ? '0'.concat(date.getSeconds().toString()) : date.getSeconds()}`,
                  }),
              }));
          });
          break;
        }
      }
    });
  }

  start() {
    this.ws.on('connection', (connection) => {
      this.unregisteredUsersCounter++;
      const client: Client = { socket: connection, userName: `User-${this.unregisteredUsersCounter}` };
      this.clients.push(client);
      console.log(chalk.bgYellow(`New user ${client.userName} is connected!`));
      this.connectionOnClose(connection);
      this.connectionOnMessage(connection);
    });
  }
}

export default WebsocketServer;
