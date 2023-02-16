import express from 'express';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import DBUno from './database';
import { DBUsers, UserInfo } from './game/types';
import { createHmac } from 'crypto';
export const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';

function hashPassword(pass: string): string {
  const secret = '666UNOgameGAMEuno999';
  return createHmac('sha256', secret)
    .update(pass)
    .digest('hex');
}


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json(), cookieParser('UNOsecretCOOKIE'), cors({ credentials: true, origin: 'http://localhost:9000' }));

app.post('/registration', async (req, res)=>{
  const user = req.body as UserInfo;
  await DBUno.openDB('write').then(() => {
    DBUno.db.get('SELECT * FROM Users where UserName = ?', [user.userName], (err, data: DBUsers) => {
      if (data?.UserId !== undefined) {
        console.log(chalk.yellow(`New user with nickname: '${user.userName}' try registered, but this nickname already exist...`));
        res.send(JSON.stringify({ status: false }));
      } else {
        user.password = hashPassword(user.password);
        DBUno.db.run('INSERT INTO Users(UserName, UserPassword, Email) VALUES(?, ?, ?)',
          [user.userName, user.password, user.email],
          (err) => {if (err) console.log(err);});
        console.log(chalk.green(`New user with nickname: '${user.userName}' successful registered!`));
        res.send(JSON.stringify({ status: true }));
      }
    });
  }).then(()=> DBUno.closeDB()).catch();
});

app.post('/login', async (req, res)=>{
  const user = req.body as { userName: string, password: string };
  await DBUno.openDB().then(()=> {
    DBUno.db.get('SELECT * FROM Users where UserName = ?', [user.userName], (err, data: DBUsers) => {
      if (data?.UserId !== undefined && data.UserPassword === hashPassword(user.password)) {
        const d = new Date();
        d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
        console.log(chalk.green(`A user with a nickname '${user.userName}' is logged into the site!`));
        res.send(JSON.stringify({ status: true, data: `user=${user.userName};expires=${d.toString()}` }));
      } else {
        console.log(chalk.red(`Try user with a nickname '${user.userName}' logged`));
        res.send(JSON.stringify({ status: false, data: '' }));
      }
    });
  }).then(()=> DBUno.closeDB()).catch();
});
