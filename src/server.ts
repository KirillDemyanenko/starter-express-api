import WebsocketServer from './websocket';
import { app } from './express';
import chalk from 'chalk';
const wss = new WebsocketServer(9001);
wss.start();
app.listen(9002, ()=>console.log(chalk.bgCyan('Сервер запущен...')));
