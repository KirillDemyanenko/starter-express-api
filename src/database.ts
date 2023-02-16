import { Database, OPEN_READONLY, OPEN_READWRITE } from 'sqlite3';
import path from 'path';
import { DBUsers } from './game/types';
import chalk from 'chalk';

class DBUno {
  static db: Database;

  static path = path.resolve(__dirname, 'db/db.sqlite');

  static async readAllUsers(): Promise<void> {
    await DBUno.openDB().then(() => {
      DBUno.db.all('SELECT * FROM Users',
        (_, res: DBUsers[]) => console.log(...res),
      );
    });
  }

  static closeDB() {
    DBUno.db.close((e) => {
      if (e) {
        console.log(e);
      } else {
        console.log(chalk.bgGreen('Successfully disconnected from database!'));
      }
    });
  }

  static async openDB(flag = 'read') {
    DBUno.db = new Database(DBUno.path, flag === 'read' ? OPEN_READONLY : OPEN_READWRITE, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(chalk.bgGreen(`Successfully connected to database in ${flag === 'read' ? 'readonly' : 'read/write'} mode!`));
      }
    });
  }
}
export default DBUno;
