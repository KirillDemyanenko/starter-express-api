/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/database.ts":
/*!*************************!*\
  !*** ./src/database.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sqlite3_1 = __webpack_require__(/*! sqlite3 */ "sqlite3");
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "chalk"));
class DBUno {
    static readAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DBUno.openDB().then(() => {
                DBUno.db.all('SELECT * FROM Users', (_, res) => console.log(...res));
            });
        });
    }
    static closeDB() {
        DBUno.db.close((e) => {
            if (e) {
                console.log(e);
            }
            else {
                console.log(chalk_1.default.bgGreen('Successfully disconnected from database!'));
            }
        });
    }
    static openDB(flag = 'read') {
        return __awaiter(this, void 0, void 0, function* () {
            DBUno.db = new sqlite3_1.Database(DBUno.path, flag === 'read' ? sqlite3_1.OPEN_READONLY : sqlite3_1.OPEN_READWRITE, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(chalk_1.default.bgGreen(`Successfully connected to database in ${flag === 'read' ? 'readonly' : 'read/write'} mode!`));
                }
            });
        });
    }
}
DBUno.path = path_1.default.resolve(__dirname, 'db/db.sqlite');
exports["default"] = DBUno;


/***/ }),

/***/ "./src/express.ts":
/*!************************!*\
  !*** ./src/express.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.app = void 0;
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "chalk"));
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const database_1 = __importDefault(__webpack_require__(/*! ./database */ "./src/database.ts"));
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
exports.app = (0, express_1.default)();
const cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ "cookie-parser"));
const cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
function hashPassword(pass) {
    const secret = '666UNOgameGAMEuno999';
    return (0, crypto_1.createHmac)('sha256', secret)
        .update(pass)
        .digest('hex');
}
exports.app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
exports.app.use(body_parser_1.default.json(), (0, cookie_parser_1.default)('UNOsecretCOOKIE'), (0, cors_1.default)({ credentials: true, origin: 'http://localhost:9000' }));
exports.app.post('/registration', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    yield database_1.default.openDB('write').then(() => {
        database_1.default.db.get('SELECT * FROM Users where UserName = ?', [user.userName], (err, data) => {
            if ((data === null || data === void 0 ? void 0 : data.UserId) !== undefined) {
                console.log(chalk_1.default.yellow(`New user with nickname: '${user.userName}' try registered, but this nickname already exist...`));
                res.send(JSON.stringify({ status: false }));
            }
            else {
                user.password = hashPassword(user.password);
                database_1.default.db.run('INSERT INTO Users(UserName, UserPassword, Email) VALUES(?, ?, ?)', [user.userName, user.password, user.email], (err) => { if (err)
                    console.log(err); });
                console.log(chalk_1.default.green(`New user with nickname: '${user.userName}' successful registered!`));
                res.send(JSON.stringify({ status: true }));
            }
        });
    }).then(() => database_1.default.closeDB()).catch();
}));
exports.app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    yield database_1.default.openDB().then(() => {
        database_1.default.db.get('SELECT * FROM Users where UserName = ?', [user.userName], (err, data) => {
            if ((data === null || data === void 0 ? void 0 : data.UserId) !== undefined && data.UserPassword === hashPassword(user.password)) {
                const d = new Date();
                d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
                console.log(chalk_1.default.green(`A user with a nickname '${user.userName}' is logged into the site!`));
                res.send(JSON.stringify({ status: true, data: `user=${user.userName};expires=${d.toString()}` }));
            }
            else {
                console.log(chalk_1.default.red(`Try user with a nickname '${user.userName}' logged`));
                res.send(JSON.stringify({ status: false, data: '' }));
            }
        });
    }).then(() => database_1.default.closeDB()).catch();
}));


/***/ }),

/***/ "./src/game/computer-player.ts":
/*!*************************************!*\
  !*** ./src/game/computer-player.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const _ard_deck_1 = __importDefault(__webpack_require__(/*! ./сard_deck */ "./src/game/сard_deck.ts"));
class ComputerPlayer {
    constructor(name) {
        this.playersName = name;
        this.cardsInHand = [];
    }
    selectPossibleOptionsForMove(topCardId, currentColor) {
        const topCardInfo = _ard_deck_1.default.getColorAndValue(topCardId);
        const optionsOfMove = [];
        for (let i = 0; i < this.cardsInHand.length; i++) {
            const cardInfo = _ard_deck_1.default.getColorAndValue(this.cardsInHand[i]);
            if (topCardInfo.color === _ard_deck_1.default.colors[4]) {
                if (cardInfo.color === currentColor || cardInfo.color === _ard_deck_1.default.colors[4]) {
                    optionsOfMove.push(this.cardsInHand[i]);
                }
            }
            else if (cardInfo.color === topCardInfo.color || cardInfo.value === topCardInfo.value || cardInfo.color === _ard_deck_1.default.colors[4]) {
                optionsOfMove.push(this.cardsInHand[i]);
            }
        }
        return optionsOfMove;
    }
    chooseColor() {
        const colorArr = ['blue', 'green', 'red', 'yellow'].sort(() => Math.random() - 0.5);
        return colorArr[0];
    }
    takeCards(cards) {
        this.cardsInHand.push(...cards);
    }
    getNumberOfCardsInHand() {
        return this.cardsInHand.length;
    }
    getYourCards() {
        return this.cardsInHand;
    }
    clearDeck() {
        this.cardsInHand.length = 0;
    }
    getFirstMove() {
        let randomCard = this.cardsInHand[Math.floor(Math.random() * this.cardsInHand.length)];
        while (_ard_deck_1.default.getColorAndValue(randomCard).value > 9) {
            randomCard = this.cardsInHand[Math.floor(Math.random() * this.cardsInHand.length)];
        }
        this.cardsInHand.splice(this.cardsInHand.indexOf(randomCard), 1);
        return randomCard;
    }
    getMove(deck, topCardId, currentColor) {
        const options = this.selectPossibleOptionsForMove(topCardId, currentColor);
        if (options.length > 0) {
            const randomCard = options[Math.floor(Math.random() * options.length)];
            this.cardsInHand.splice(this.cardsInHand.indexOf(randomCard), 1);
            return randomCard;
        }
        else {
            return 999;
        }
    }
}
exports["default"] = ComputerPlayer;


/***/ }),

/***/ "./src/game/player.ts":
/*!****************************!*\
  !*** ./src/game/player.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const _ard_deck_1 = __importDefault(__webpack_require__(/*! ./сard_deck */ "./src/game/сard_deck.ts"));
class Player {
    constructor(name) {
        this.playersName = name;
        this.cardsInHand = [];
    }
    clearDeck() {
        this.cardsInHand.length = 0;
    }
    takeCards(cards) {
        this.cardsInHand.push(...cards);
    }
    getNumberOfCardsInHand() {
        return this.cardsInHand.length;
    }
    getYourCards() {
        return this.cardsInHand;
    }
    selectPossibleOptionsForMove(topCardId, currentColor) {
        const topCardInfo = _ard_deck_1.default.getColorAndValue(topCardId);
        const optionsOfMove = [];
        for (let i = 0; i < this.cardsInHand.length; i++) {
            const cardInfo = _ard_deck_1.default.getColorAndValue(this.cardsInHand[i]);
            if (topCardInfo.color === _ard_deck_1.default.colors[4]) {
                if (cardInfo.color === currentColor || cardInfo.color === _ard_deck_1.default.colors[4]) {
                    optionsOfMove.push(this.cardsInHand[i]);
                }
            }
            else if (cardInfo.color === topCardInfo.color || cardInfo.value === topCardInfo.value || cardInfo.color === _ard_deck_1.default.colors[4]) {
                optionsOfMove.push(this.cardsInHand[i]);
            }
        }
        return optionsOfMove.length > 0;
    }
    getMove(cardId) {
        this.cardsInHand.splice(this.cardsInHand.indexOf(cardId), 1);
        return cardId;
    }
}
exports["default"] = Player;


/***/ }),

/***/ "./src/game/uno-game.ts":
/*!******************************!*\
  !*** ./src/game/uno-game.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const _ard_deck_1 = __importDefault(__webpack_require__(/*! ./сard_deck */ "./src/game/сard_deck.ts"));
const computer_player_1 = __importDefault(__webpack_require__(/*! ./computer-player */ "./src/game/computer-player.ts"));
const player_1 = __importDefault(__webpack_require__(/*! ./player */ "./src/game/player.ts"));
class UnoGame {
    constructor(numberOfPlayers, client) {
        var _a;
        this.players = [];
        this.deck = new _ard_deck_1.default();
        this.gameWinner = '';
        this.gameResults = [];
        this.user = client;
        this.topCard = 999;
        this.currentColor = '';
        this.reverse = false;
        this.currentPlayerId = 0;
        this.movesCount = 0;
        this.weNotHaveAWinner = true;
        this.client = client;
        this.numberOfPlayers = numberOfPlayers;
        this.players.push({ player: new player_1.default(client.userName) });
        for (let i = 1; i < numberOfPlayers; i++) {
            this.players.push({ player: new computer_player_1.default(`Computer-${i}`) });
            this.gameResults.push({ player: (_a = this.players[i].player) === null || _a === void 0 ? void 0 : _a.playersName, total: 0 });
        }
    }
    setNextPlayerID() {
        if (this.reverse) {
            if (this.currentPlayerId - 1 < 0) {
                this.currentPlayerId = this.players.length - 1;
            }
            else {
                this.currentPlayerId--;
            }
        }
        else {
            if (this.currentPlayerId + 1 === this.players.length) {
                this.currentPlayerId = 0;
            }
            else {
                this.currentPlayerId++;
            }
        }
    }
    computersMove() {
        let move = this.players[this.currentPlayerId].player.getMove(this.deck, this.topCard, this.currentColor);
        if (move === 999 && this.deck.isNoMoreCards()) {
            this.takeCards(1);
            move = this.players[this.currentPlayerId].player.getMove(this.deck, this.topCard, this.currentColor);
        }
        if (move !== 999) {
            const cardInfo = _ard_deck_1.default.getColorAndValue(move);
            this.topCard = move;
            if (cardInfo.color === _ard_deck_1.default.colors[4]) {
                this.wildCardActions();
            }
            else {
                this.currentColor = cardInfo.color;
                this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
            }
            if (cardInfo.value > 9 && cardInfo.value < 13) {
                this.funCardsActions();
            }
            this.deck.discardCard(move);
        }
        else {
            this.sendMessage(`${this.players[this.currentPlayerId].player.playersName} cant move and skip the turn!`);
        }
    }
    sendMessage(message) {
        this.user.socket.send(JSON.stringify({ action: 'MESSAGE', data: message }));
    }
    checkUsersMove(cardId) {
        const cardInfo = _ard_deck_1.default.getColorAndValue(cardId);
        const topCardInfo = _ard_deck_1.default.getColorAndValue(this.topCard);
        if (this.topCard === 999) {
            return !(cardInfo.color === _ard_deck_1.default.colors[4] || cardInfo.value > 9);
        }
        else {
            return topCardInfo.color === _ard_deck_1.default.colors[4]
                ? cardInfo.color === this.currentColor || cardInfo.color === _ard_deck_1.default.colors[4]
                : cardInfo.color === topCardInfo.color
                    || cardInfo.value === topCardInfo.value
                    || cardInfo.color === _ard_deck_1.default.colors[4];
        }
    }
    dealCardToUser(quantity) {
        this.players[0].player.takeCards(this.deck.getCards(quantity));
        this.players[0].player.getYourCards().forEach(value => {
            const dataForSend = JSON.stringify({ player: `player-${1}`, card: _ard_deck_1.default.getColorAndValue(value) });
            this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
        });
    }
    dealCardToComputer(quantity) {
        for (let i = 1; i < this.players.length; i++) {
            this.players[i].player.takeCards(this.deck.getCards(quantity));
            this.players[i].player.getYourCards().forEach(value => {
                const dataForSend = JSON.stringify({ player: `player-${i + 1}`, card: _ard_deck_1.default.getColorAndValue(value) });
                this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
            });
        }
    }
    sleep(millis) {
        const t = (new Date()).getTime();
        let i = 0;
        while (((new Date()).getTime() - t) < millis) {
            i++;
        }
    }
    startComputersMoves() {
        var _a;
        if (this.weNotHaveAWinner) {
            do {
                this.sendMessage(`Move by ${(_a = this.players[this.currentPlayerId].player) === null || _a === void 0 ? void 0 : _a.playersName}`);
                this.sleep(2000);
                this.computersMove();
                this.movesCount++;
                this.setNextPlayerID();
                this.checkOneCard();
                if (!this.checkWinner()) {
                    break;
                }
            } while (this.currentPlayerId !== 0);
            this.sendMessage(`${this.players[0].player.playersName} move!`);
        }
    }
    funCardsActions() {
        var _a;
        const topCardInfo = _ard_deck_1.default.getColorAndValue(this.topCard);
        if (topCardInfo.value === 11) {
            this.sendMessage('Lets reverse');
            this.reverse = !this.reverse;
        }
        else if (topCardInfo.value === 12 || topCardInfo.value === 10) {
            this.setNextPlayerID();
            if (topCardInfo.value === 10) {
                this.takeCards(2);
            }
            else {
                this.sendMessage(`${(_a = this.players[this.currentPlayerId].player) === null || _a === void 0 ? void 0 : _a.playersName} skips a turn!`);
            }
        }
    }
    takeCards(quantity) {
        var _a, _b, _c, _d;
        switch (quantity) {
            case 1:
                this.sendMessage(`${(_a = this.players[this.currentPlayerId].player) === null || _a === void 0 ? void 0 : _a.playersName} takes ${quantity} card!`);
                break;
            default:
                this.sendMessage(`${(_b = this.players[this.currentPlayerId].player) === null || _b === void 0 ? void 0 : _b.playersName} takes ${quantity} card and skips a turn!`);
        }
        this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
        if (this.currentPlayerId === 0) {
            this.dealCardToUser(quantity);
        }
        else {
            (_c = this.players[this.currentPlayerId].player) === null || _c === void 0 ? void 0 : _c.takeCards(this.deck.getCards(quantity));
            (_d = this.players[this.currentPlayerId].player) === null || _d === void 0 ? void 0 : _d.getYourCards().forEach(value => {
                const dataForSend = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: _ard_deck_1.default.getColorAndValue(value) });
                this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
            });
        }
    }
    wildCardActions() {
        const topCardInfo = _ard_deck_1.default.getColorAndValue(this.topCard);
        if (this.currentPlayerId === 0) {
            this.sendMessage('Choose color!');
            this.user.socket.send(JSON.stringify({ action: 'USER_MUST_CHOOSE_COLOR', data: '' }));
        }
        else {
            this.currentColor = this.players[this.currentPlayerId].player.chooseColor();
            this.sendMessage(`${this.players[this.currentPlayerId].player.playersName} choose ${this.currentColor} color!`);
            this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: topCardInfo, currentColor: this.currentColor }) }));
            if (topCardInfo.value === 14) {
                this.setNextPlayerID();
                this.takeCards(4);
            }
        }
    }
    stopGame() {
        const roundResult = this.calculatePoints();
        this.gameResults.forEach(value => {
            if (roundResult.player === value.player) {
                value.total += roundResult.total;
                if (value.total >= 250) {
                    this.gameWinner = value.player;
                }
            }
        });
        if (this.gameWinner !== '') {
            this.sendMessage(`${this.gameWinner} win the game!`);
        }
        else {
            this.deck = new _ard_deck_1.default();
            this.topCard = 999;
            this.currentColor = '';
            this.reverse = false;
            this.currentPlayerId = 0;
            this.movesCount = 0;
            this.weNotHaveAWinner = true;
            this.players.forEach(value => { var _a; return (_a = value.player) === null || _a === void 0 ? void 0 : _a.clearDeck(); });
            this.sleep(5000);
            this.user.socket.send(JSON.stringify({ action: 'CLEAR_FIELD', data: '' }));
            this.startGame();
        }
    }
    calculatePoints() {
        var _a, _b;
        const results = [];
        const total = { player: '', total: 0 };
        for (let i = 0; i < this.players.length; i++) {
            const userResult = { player: (_a = this.players[i].player) === null || _a === void 0 ? void 0 : _a.playersName, points: 0 };
            (_b = this.players[i].player) === null || _b === void 0 ? void 0 : _b.getYourCards().forEach(value => {
                const cardInfo = _ard_deck_1.default.getColorAndValue(value);
                switch (cardInfo.value) {
                    case 13 || 0: {
                        userResult.points += 50;
                        break;
                    }
                    case 10 || 0 || 0: {
                        userResult.points += 20;
                        break;
                    }
                    default: {
                        userResult.points += cardInfo.value;
                        break;
                    }
                }
            });
            results.push(userResult);
        }
        for (const us of results) {
            if (us.points === 0) {
                total.player = us.player;
            }
            else {
                total.total += us.points;
            }
        }
        this.user.socket.send(JSON.stringify({ action: 'RESULTS_OF_ROUND', data: JSON.stringify(results) }));
        return total;
    }
    checkWinner() {
        var _a;
        if (this.players.filter(value => { var _a; return ((_a = value.player) === null || _a === void 0 ? void 0 : _a.getNumberOfCardsInHand()) === 0; }).length === 1) {
            this.sendMessage(`${(_a = this.players.filter(value => { var _a; return ((_a = value.player) === null || _a === void 0 ? void 0 : _a.getNumberOfCardsInHand()) === 0; })[0].player) === null || _a === void 0 ? void 0 : _a.playersName} is win this round!`);
            this.stopGame();
            return false;
        }
        return true;
    }
    pushUnoButton() {
        for (let i = 1; i < this.players.length; i++) {
            setTimeout(() => this.user.socket.send(JSON.stringify({ action: 'PUSH_UNO_BUTTON', data: '' })), Math.floor(Math.random() * (7000 - 1000 + 1) + 1000));
        }
    }
    checkOneCard() {
        var _a;
        if (((_a = this.players[this.currentPlayerId].player) === null || _a === void 0 ? void 0 : _a.getNumberOfCardsInHand()) === 1) {
            this.pushUnoButton();
        }
    }
    startGame() {
        var _a;
        this.dealCardToUser(7);
        this.dealCardToComputer(7);
        this.sendMessage(`Move by ${(_a = this.players[0].player) === null || _a === void 0 ? void 0 : _a.playersName}`);
        this.user.socket.on('message', message => {
            const mes = JSON.parse(message.toString());
            switch (mes.action) {
                case 'MOVE_BY_USER': {
                    if (this.weNotHaveAWinner) {
                        const move = JSON.parse(mes.data);
                        if (this.checkUsersMove(parseInt(move.cardId))) {
                            this.topCard = this.players[0].player.getMove(parseInt(move.cardId));
                            const cardInfo = _ard_deck_1.default.getColorAndValue(this.topCard);
                            if (cardInfo.color === _ard_deck_1.default.colors[4]) {
                                this.wildCardActions();
                            }
                            else {
                                this.currentColor = cardInfo.color;
                                this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
                                this.deck.discardCard(this.topCard);
                                this.movesCount++;
                                if (this.checkWinner()) {
                                    if (cardInfo.value > 9 && cardInfo.value < 13) {
                                        this.funCardsActions();
                                    }
                                    this.setNextPlayerID();
                                    this.startComputersMoves();
                                }
                            }
                        }
                        else {
                            this.sendMessage('Wrong move!');
                        }
                    }
                    break;
                }
                case 'GET_CARD_BY_USER': {
                    if (this.players[0].player.selectPossibleOptionsForMove(this.topCard, this.currentColor) || this.topCard === 999) {
                        this.sendMessage('You have options for move!');
                    }
                    else {
                        this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${1}` }));
                        this.dealCardToUser(1);
                        if (!this.players[0].player.selectPossibleOptionsForMove(this.topCard, this.currentColor)) {
                            this.setNextPlayerID();
                            this.sendMessage('You cant options for move! You skip the turn!');
                            this.startComputersMoves();
                        }
                    }
                    break;
                }
                case 'GET_USERS_LIST': {
                    const usersName = [];
                    this.players.forEach(players => { var _a; return usersName.push((_a = players.player) === null || _a === void 0 ? void 0 : _a.playersName); });
                    this.user.socket.send(JSON.stringify({ action: 'SET_USERS_LIST', data: JSON.stringify(usersName) }));
                    break;
                }
                case 'USERS_SELECTED_COLOR': {
                    this.currentColor = mes.data;
                    const cardInfo = _ard_deck_1.default.getColorAndValue(this.topCard);
                    this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
                    if (cardInfo.value === 14) {
                        this.setNextPlayerID();
                        this.takeCards(4);
                    }
                    if (this.currentPlayerId + 1 >= this.players.length) {
                        this.currentPlayerId = 0;
                    }
                    else {
                        this.setNextPlayerID();
                        if (this.checkWinner()) {
                            if (this.currentPlayerId !== 0) {
                                this.startComputersMoves();
                            }
                        }
                    }
                    break;
                }
            }
        });
    }
}
exports["default"] = UnoGame;


/***/ }),

/***/ "./src/game/сard_deck.ts":
/*!*******************************!*\
  !*** ./src/game/сard_deck.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CardDeck {
    constructor() {
        this.deck = [...Array(108).keys()].map(i => i++);
        this.usersCards = [];
        this.discardedCards = [];
        this.shuffleDeck();
    }
    shuffleDeck() {
        this.deck.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
    }
    getCards(quantity = 1) {
        if (this.deck.length === 0 && this.discardedCards.length !== 0) {
            return [];
        }
        const returnedCardArray = [];
        for (let i = 0; i < quantity; i++) {
            if (this.deck.length > 0) {
                returnedCardArray.push(this.deck.pop());
            }
            else {
                if (this.discardedCards.length > 0) {
                    const topCard = this.discardedCards.pop();
                    this.deck.push(...this.discardedCards);
                    this.discardedCards = [topCard];
                    this.shuffleDeck();
                }
                else {
                    console.log('No more cards!');
                    break;
                }
            }
        }
        this.usersCards.push(...returnedCardArray);
        return returnedCardArray;
    }
    discardCard(cardId) {
        this.usersCards.splice(this.usersCards.indexOf(cardId), 1);
        this.discardedCards.push(cardId);
    }
    static getColorAndValue(cardId) {
        const cardInfo = { id: cardId, color: CardDeck.colors[Math.floor(cardId / 25)], value: 0 };
        if (cardId < 100) {
            if (cardId % 25 < 19) {
                cardInfo.value = cardId % 25 < 10 ? cardId % 25 : ((cardId % 25) % 10) + 1;
            }
            else {
                cardInfo.value = cardId % 25 < 21 ? 10 : cardId % 25 < 23 ? 11 : 12;
            }
        }
        else {
            cardInfo.value = cardId < 104 ? 13 : 14;
        }
        return cardInfo;
    }
    isNoMoreCards() {
        return this.discardedCards.length > 0 || this.deck.length > 0;
    }
}
CardDeck.colors = ['blue', 'green', 'red', 'yellow', 'black'];
exports["default"] = CardDeck;


/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const websocket_1 = __importDefault(__webpack_require__(/*! ./websocket */ "./src/websocket.ts"));
const express_1 = __webpack_require__(/*! ./express */ "./src/express.ts");
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "chalk"));
const wss = new websocket_1.default(9001);
wss.start();
express_1.app.listen(9002, () => console.log(chalk_1.default.bgCyan('Сервер запущен...')));


/***/ }),

/***/ "./src/websocket.ts":
/*!**************************!*\
  !*** ./src/websocket.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ws_1 = __importDefault(__webpack_require__(/*! ws */ "ws"));
const http = __importStar(__webpack_require__(/*! http */ "http"));
const uno_game_1 = __importDefault(__webpack_require__(/*! ./game/uno-game */ "./src/game/uno-game.ts"));
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "chalk"));
class WebsocketServer {
    constructor(port) {
        this.clients = [];
        this.games = [];
        this.unregisteredUsersCounter = 0;
        const server = http.createServer((req, res) => {
            res.writeHead(200);
            res.end('index.html');
        });
        this.ws = new ws_1.default.Server({ server });
        server.listen(port, () => {
            console.log(chalk_1.default.bgCyan(`Listen port ${port}`));
        });
    }
    connectionOnClose(connection) {
        connection.on('close', () => {
            const client = this.clients.filter(value => {
                return value.socket === connection;
            })[0];
            console.log(chalk_1.default.bgRedBright(`${client.userName} is disconnected!`));
            this.clients = this.clients.filter(value => {
                return value.socket !== connection;
            });
        });
    }
    findClient(connection) {
        return this.clients.filter(value => {
            return value.socket === connection;
        })[0];
    }
    connectionOnMessage(connection) {
        connection.on('message', (message) => {
            const msg = JSON.parse(message.toString());
            switch (msg.action) {
                case 'CREATE_GAME': {
                    const settings = JSON.parse(msg.data);
                    const newGame = {
                        id: this.games.length + 1,
                        game: new uno_game_1.default(settings.players, this.findClient(connection)),
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
                            console.log(chalk_1.default.bgBlue(`User ${value.userName} update nickname on ${msg.data}`));
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
                        value.socket.send(JSON.stringify({
                            action: 'INCOME_CHAT_MESSAGE',
                            data: JSON.stringify({
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
            const client = { socket: connection, userName: `User-${this.unregisteredUsersCounter}` };
            this.clients.push(client);
            console.log(chalk_1.default.bgYellow(`New user ${client.userName} is connected!`));
            this.connectionOnClose(connection);
            this.connectionOnMessage(connection);
        });
    }
}
exports["default"] = WebsocketServer;


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "chalk":
/*!************************!*\
  !*** external "chalk" ***!
  \************************/
/***/ ((module) => {

module.exports = require("chalk");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("sqlite3");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("ws");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91bm8tc2VydmVyLy4vc3JjL2RhdGFiYXNlLnRzIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvLi9zcmMvZXhwcmVzcy50cyIsIndlYnBhY2s6Ly91bm8tc2VydmVyLy4vc3JjL2dhbWUvY29tcHV0ZXItcGxheWVyLnRzIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvLi9zcmMvZ2FtZS9wbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vdW5vLXNlcnZlci8uL3NyYy9nYW1lL3Vuby1nYW1lLnRzIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvLi9zcmMvZ2FtZS/RgWFyZF9kZWNrLnRzIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvLi9zcmMvc2VydmVyLnRzIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvLi9zcmMvd2Vic29ja2V0LnRzIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJib2R5LXBhcnNlclwiIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJjaGFsa1wiIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJjb29raWUtcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vdW5vLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly91bm8tc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL3Vuby1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vdW5vLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcInNxbGl0ZTNcIiIsIndlYnBhY2s6Ly91bm8tc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwid3NcIiIsIndlYnBhY2s6Ly91bm8tc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly91bm8tc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vdW5vLXNlcnZlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly91bm8tc2VydmVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdW5vLXNlcnZlci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdW5vLXNlcnZlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0YWJhc2UsIE9QRU5fUkVBRE9OTFksIE9QRU5fUkVBRFdSSVRFIH0gZnJvbSAnc3FsaXRlMyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBEQlVzZXJzIH0gZnJvbSAnLi9nYW1lL3R5cGVzJztcclxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcclxuXHJcbmNsYXNzIERCVW5vIHtcclxuICBzdGF0aWMgZGI6IERhdGFiYXNlO1xyXG5cclxuICBzdGF0aWMgcGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdkYi9kYi5zcWxpdGUnKTtcclxuXHJcbiAgc3RhdGljIGFzeW5jIHJlYWRBbGxVc2VycygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGF3YWl0IERCVW5vLm9wZW5EQigpLnRoZW4oKCkgPT4ge1xyXG4gICAgICBEQlVuby5kYi5hbGwoJ1NFTEVDVCAqIEZST00gVXNlcnMnLFxyXG4gICAgICAgIChfLCByZXM6IERCVXNlcnNbXSkgPT4gY29uc29sZS5sb2coLi4ucmVzKSxcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNsb3NlREIoKSB7XHJcbiAgICBEQlVuby5kYi5jbG9zZSgoZSkgPT4ge1xyXG4gICAgICBpZiAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmJnR3JlZW4oJ1N1Y2Nlc3NmdWxseSBkaXNjb25uZWN0ZWQgZnJvbSBkYXRhYmFzZSEnKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFzeW5jIG9wZW5EQihmbGFnID0gJ3JlYWQnKSB7XHJcbiAgICBEQlVuby5kYiA9IG5ldyBEYXRhYmFzZShEQlVuby5wYXRoLCBmbGFnID09PSAncmVhZCcgPyBPUEVOX1JFQURPTkxZIDogT1BFTl9SRUFEV1JJVEUsIChlcnIpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsuYmdHcmVlbihgU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byBkYXRhYmFzZSBpbiAke2ZsYWcgPT09ICdyZWFkJyA/ICdyZWFkb25seScgOiAncmVhZC93cml0ZSd9IG1vZGUhYCkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgREJVbm87XHJcbiIsImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XHJcbmltcG9ydCBEQlVubyBmcm9tICcuL2RhdGFiYXNlJztcclxuaW1wb3J0IHsgREJVc2VycywgVXNlckluZm8gfSBmcm9tICcuL2dhbWUvdHlwZXMnO1xyXG5pbXBvcnQgeyBjcmVhdGVIbWFjIH0gZnJvbSAnY3J5cHRvJztcclxuZXhwb3J0IGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuaW1wb3J0IGNvb2tpZVBhcnNlciBmcm9tICdjb29raWUtcGFyc2VyJztcclxuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XHJcblxyXG5mdW5jdGlvbiBoYXNoUGFzc3dvcmQocGFzczogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBzZWNyZXQgPSAnNjY2VU5PZ2FtZUdBTUV1bm85OTknO1xyXG4gIHJldHVybiBjcmVhdGVIbWFjKCdzaGEyNTYnLCBzZWNyZXQpXHJcbiAgICAudXBkYXRlKHBhc3MpXHJcbiAgICAuZGlnZXN0KCdoZXgnKTtcclxufVxyXG5cclxuXHJcbmFwcC51c2UoZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgcmVzLmhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcclxuICByZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnKTtcclxuICBuZXh0KCk7XHJcbn0pO1xyXG5cclxuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSwgY29va2llUGFyc2VyKCdVTk9zZWNyZXRDT09LSUUnKSwgY29ycyh7IGNyZWRlbnRpYWxzOiB0cnVlLCBvcmlnaW46ICdodHRwOi8vbG9jYWxob3N0OjkwMDAnIH0pKTtcclxuXHJcbmFwcC5wb3N0KCcvcmVnaXN0cmF0aW9uJywgYXN5bmMgKHJlcSwgcmVzKT0+e1xyXG4gIGNvbnN0IHVzZXIgPSByZXEuYm9keSBhcyBVc2VySW5mbztcclxuICBhd2FpdCBEQlVuby5vcGVuREIoJ3dyaXRlJykudGhlbigoKSA9PiB7XHJcbiAgICBEQlVuby5kYi5nZXQoJ1NFTEVDVCAqIEZST00gVXNlcnMgd2hlcmUgVXNlck5hbWUgPSA/JywgW3VzZXIudXNlck5hbWVdLCAoZXJyLCBkYXRhOiBEQlVzZXJzKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhPy5Vc2VySWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnllbGxvdyhgTmV3IHVzZXIgd2l0aCBuaWNrbmFtZTogJyR7dXNlci51c2VyTmFtZX0nIHRyeSByZWdpc3RlcmVkLCBidXQgdGhpcyBuaWNrbmFtZSBhbHJlYWR5IGV4aXN0Li4uYCkpO1xyXG4gICAgICAgIHJlcy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgc3RhdHVzOiBmYWxzZSB9KSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXNlci5wYXNzd29yZCA9IGhhc2hQYXNzd29yZCh1c2VyLnBhc3N3b3JkKTtcclxuICAgICAgICBEQlVuby5kYi5ydW4oJ0lOU0VSVCBJTlRPIFVzZXJzKFVzZXJOYW1lLCBVc2VyUGFzc3dvcmQsIEVtYWlsKSBWQUxVRVMoPywgPywgPyknLFxyXG4gICAgICAgICAgW3VzZXIudXNlck5hbWUsIHVzZXIucGFzc3dvcmQsIHVzZXIuZW1haWxdLFxyXG4gICAgICAgICAgKGVycikgPT4ge2lmIChlcnIpIGNvbnNvbGUubG9nKGVycik7fSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oYE5ldyB1c2VyIHdpdGggbmlja25hbWU6ICcke3VzZXIudXNlck5hbWV9JyBzdWNjZXNzZnVsIHJlZ2lzdGVyZWQhYCkpO1xyXG4gICAgICAgIHJlcy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgc3RhdHVzOiB0cnVlIH0pKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSkudGhlbigoKT0+IERCVW5vLmNsb3NlREIoKSkuY2F0Y2goKTtcclxufSk7XHJcblxyXG5hcHAucG9zdCgnL2xvZ2luJywgYXN5bmMgKHJlcSwgcmVzKT0+e1xyXG4gIGNvbnN0IHVzZXIgPSByZXEuYm9keSBhcyB7IHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcgfTtcclxuICBhd2FpdCBEQlVuby5vcGVuREIoKS50aGVuKCgpPT4ge1xyXG4gICAgREJVbm8uZGIuZ2V0KCdTRUxFQ1QgKiBGUk9NIFVzZXJzIHdoZXJlIFVzZXJOYW1lID0gPycsIFt1c2VyLnVzZXJOYW1lXSwgKGVyciwgZGF0YTogREJVc2VycykgPT4ge1xyXG4gICAgICBpZiAoZGF0YT8uVXNlcklkICE9PSB1bmRlZmluZWQgJiYgZGF0YS5Vc2VyUGFzc3dvcmQgPT09IGhhc2hQYXNzd29yZCh1c2VyLnBhc3N3b3JkKSkge1xyXG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArICgxMCAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihgQSB1c2VyIHdpdGggYSBuaWNrbmFtZSAnJHt1c2VyLnVzZXJOYW1lfScgaXMgbG9nZ2VkIGludG8gdGhlIHNpdGUhYCkpO1xyXG4gICAgICAgIHJlcy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgc3RhdHVzOiB0cnVlLCBkYXRhOiBgdXNlcj0ke3VzZXIudXNlck5hbWV9O2V4cGlyZXM9JHtkLnRvU3RyaW5nKCl9YCB9KSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKGBUcnkgdXNlciB3aXRoIGEgbmlja25hbWUgJyR7dXNlci51c2VyTmFtZX0nIGxvZ2dlZGApKTtcclxuICAgICAgICByZXMuc2VuZChKU09OLnN0cmluZ2lmeSh7IHN0YXR1czogZmFsc2UsIGRhdGE6ICcnIH0pKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSkudGhlbigoKT0+IERCVW5vLmNsb3NlREIoKSkuY2F0Y2goKTtcclxufSk7XHJcbiIsIi8qIEEgY2xhc3MgdGhhdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgdGhlIGNvbXB1dGVyIHBsYXllciAqL1xyXG5pbXBvcnQgQ2FyZERlY2sgZnJvbSAnLi/RgWFyZF9kZWNrJztcclxuaW1wb3J0IHsgQ2FyZEluZm8gfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmNsYXNzIENvbXB1dGVyUGxheWVyIHtcclxuICBwdWJsaWMgcmVhZG9ubHkgcGxheWVyc05hbWU6IHN0cmluZztcclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBjYXJkc0luSGFuZDogbnVtYmVyW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5wbGF5ZXJzTmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLmNhcmRzSW5IYW5kID0gW107XHJcbiAgfVxyXG5cclxuICAvKiBDaG9vc2VzIHBvc3NpYmxlIG1vdmVzIGRlcGVuZGluZyBvbiB0aGUgY2FyZCBseWluZyBvbiB0aGUgdGFibGUgYW5kIHRoZSBhdmFpbGFibGUgY2FyZHMgKi9cclxuICBzZWxlY3RQb3NzaWJsZU9wdGlvbnNGb3JNb3ZlKHRvcENhcmRJZDogbnVtYmVyLCBjdXJyZW50Q29sb3I/OiBzdHJpbmcpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCB0b3BDYXJkSW5mbyA9IENhcmREZWNrLmdldENvbG9yQW5kVmFsdWUodG9wQ2FyZElkKTtcclxuICAgIGNvbnN0IG9wdGlvbnNPZk1vdmU6IG51bWJlcltdID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHNJbkhhbmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgY2FyZEluZm8gOiBDYXJkSW5mbyA9IENhcmREZWNrLmdldENvbG9yQW5kVmFsdWUodGhpcy5jYXJkc0luSGFuZFtpXSk7XHJcbiAgICAgIGlmICh0b3BDYXJkSW5mby5jb2xvciA9PT0gQ2FyZERlY2suY29sb3JzWzRdKSB7XHJcbiAgICAgICAgaWYgKGNhcmRJbmZvLmNvbG9yID09PSBjdXJyZW50Q29sb3IgfHwgY2FyZEluZm8uY29sb3IgPT09IENhcmREZWNrLmNvbG9yc1s0XSkge1xyXG4gICAgICAgICAgb3B0aW9uc09mTW92ZS5wdXNoKHRoaXMuY2FyZHNJbkhhbmRbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChjYXJkSW5mby5jb2xvciA9PT0gdG9wQ2FyZEluZm8uY29sb3IgfHwgY2FyZEluZm8udmFsdWUgPT09IHRvcENhcmRJbmZvLnZhbHVlIHx8IGNhcmRJbmZvLmNvbG9yID09PSBDYXJkRGVjay5jb2xvcnNbNF0pIHtcclxuICAgICAgICBvcHRpb25zT2ZNb3ZlLnB1c2godGhpcy5jYXJkc0luSGFuZFtpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvcHRpb25zT2ZNb3ZlO1xyXG4gIH1cclxuXHJcbiAgLyogQ2hvb3NlIGNvbG9yICovXHJcbiAgY2hvb3NlQ29sb3IoKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNvbG9yQXJyID0gWydibHVlJywgJ2dyZWVuJywgJ3JlZCcsICd5ZWxsb3cnXS5zb3J0KCgpID0+IE1hdGgucmFuZG9tKCkgLSAwLjUpO1xyXG4gICAgcmV0dXJuIGNvbG9yQXJyWzBdO1xyXG4gIH1cclxuXHJcbiAgLyogQWRkcyBjYXJkcyB0byBoYW5kICovXHJcbiAgdGFrZUNhcmRzKGNhcmRzOiBudW1iZXJbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5jYXJkc0luSGFuZC5wdXNoKC4uLmNhcmRzKTtcclxuICB9XHJcblxyXG4gIC8qIFJldHVybnMgdGhlIG51bWJlciBvZiBjYXJkcyBpbiBoYW5kICovXHJcbiAgZ2V0TnVtYmVyT2ZDYXJkc0luSGFuZCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZHNJbkhhbmQubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyogcmV0dXJucyBhbGwgcGxheWVyIGNhcmRzICovXHJcbiAgZ2V0WW91ckNhcmRzKCk6IG51bWJlcltdIHtcclxuICAgIHJldHVybiB0aGlzLmNhcmRzSW5IYW5kO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJEZWNrKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jYXJkc0luSGFuZC5sZW5ndGggPSAwO1xyXG4gIH1cclxuXHJcbiAgLyogTWFrZXMgdGhlIGZpcnN0IG1vdmUgKi9cclxuICBnZXRGaXJzdE1vdmUoKTogbnVtYmVyIHtcclxuICAgIGxldCByYW5kb21DYXJkOiBudW1iZXIgPSB0aGlzLmNhcmRzSW5IYW5kW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FyZHNJbkhhbmQubGVuZ3RoKV07XHJcbiAgICB3aGlsZSAoQ2FyZERlY2suZ2V0Q29sb3JBbmRWYWx1ZShyYW5kb21DYXJkKS52YWx1ZSA+IDkpIHtcclxuICAgICAgcmFuZG9tQ2FyZCA9IHRoaXMuY2FyZHNJbkhhbmRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jYXJkc0luSGFuZC5sZW5ndGgpXTtcclxuICAgIH1cclxuICAgIHRoaXMuY2FyZHNJbkhhbmQuc3BsaWNlKHRoaXMuY2FyZHNJbkhhbmQuaW5kZXhPZihyYW5kb21DYXJkKSwgMSk7XHJcbiAgICByZXR1cm4gcmFuZG9tQ2FyZDtcclxuICB9XHJcblxyXG4gIC8qIE1ha2VzIGEgbW92ZSBvbiBvbmUgb2YgdGhlIHBvc3NpYmxlIG9wdGlvbnNcclxuICAqIHJldHVybnMgOTk5IGlmIHRoZXJlIGFyZSBubyBtb3JlIGNhcmRzIHRvIGRyYXcgYW5kIHRoZSBjb21wdXRlciBoYXMgbm8gb3B0aW9ucyAgKi9cclxuICBnZXRNb3ZlKGRlY2s6IENhcmREZWNrLCB0b3BDYXJkSWQ6IG51bWJlciwgY3VycmVudENvbG9yPzogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG9wdGlvbnM6IG51bWJlcltdID0gdGhpcy5zZWxlY3RQb3NzaWJsZU9wdGlvbnNGb3JNb3ZlKHRvcENhcmRJZCwgY3VycmVudENvbG9yKTtcclxuICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgcmFuZG9tQ2FyZDogbnVtYmVyID0gb3B0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcHRpb25zLmxlbmd0aCldO1xyXG4gICAgICB0aGlzLmNhcmRzSW5IYW5kLnNwbGljZSh0aGlzLmNhcmRzSW5IYW5kLmluZGV4T2YocmFuZG9tQ2FyZCksIDEpO1xyXG4gICAgICByZXR1cm4gcmFuZG9tQ2FyZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiA5OTk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb21wdXRlclBsYXllcjtcclxuIiwiaW1wb3J0IENhcmREZWNrIGZyb20gJy4v0YFhcmRfZGVjayc7XHJcbmltcG9ydCB7IENhcmRJbmZvIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gIHB1YmxpYyBwbGF5ZXJzTmFtZTogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IGNhcmRzSW5IYW5kOiBudW1iZXJbXTtcclxuXHJcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnBsYXllcnNOYW1lID0gbmFtZTtcclxuICAgIHRoaXMuY2FyZHNJbkhhbmQgPSBbXTtcclxuICB9XHJcblxyXG4gIGNsZWFyRGVjaygpOiB2b2lkIHtcclxuICAgIHRoaXMuY2FyZHNJbkhhbmQubGVuZ3RoID0gMDtcclxuICB9XHJcblxyXG4gIHRha2VDYXJkcyhjYXJkczogbnVtYmVyW10pOiB2b2lkIHtcclxuICAgIHRoaXMuY2FyZHNJbkhhbmQucHVzaCguLi5jYXJkcyk7XHJcbiAgfVxyXG5cclxuICBnZXROdW1iZXJPZkNhcmRzSW5IYW5kKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJkc0luSGFuZC5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRZb3VyQ2FyZHMoKTogbnVtYmVyW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZHNJbkhhbmQ7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RQb3NzaWJsZU9wdGlvbnNGb3JNb3ZlKHRvcENhcmRJZDogbnVtYmVyLCBjdXJyZW50Q29sb3I/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHRvcENhcmRJbmZvID0gQ2FyZERlY2suZ2V0Q29sb3JBbmRWYWx1ZSh0b3BDYXJkSWQpO1xyXG4gICAgY29uc3Qgb3B0aW9uc09mTW92ZTogbnVtYmVyW10gPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkc0luSGFuZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBjYXJkSW5mbyA6IENhcmRJbmZvID0gQ2FyZERlY2suZ2V0Q29sb3JBbmRWYWx1ZSh0aGlzLmNhcmRzSW5IYW5kW2ldKTtcclxuICAgICAgaWYgKHRvcENhcmRJbmZvLmNvbG9yID09PSBDYXJkRGVjay5jb2xvcnNbNF0pIHtcclxuICAgICAgICBpZiAoY2FyZEluZm8uY29sb3IgPT09IGN1cnJlbnRDb2xvciB8fCBjYXJkSW5mby5jb2xvciA9PT0gQ2FyZERlY2suY29sb3JzWzRdKSB7XHJcbiAgICAgICAgICBvcHRpb25zT2ZNb3ZlLnB1c2godGhpcy5jYXJkc0luSGFuZFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNhcmRJbmZvLmNvbG9yID09PSB0b3BDYXJkSW5mby5jb2xvciB8fCBjYXJkSW5mby52YWx1ZSA9PT0gdG9wQ2FyZEluZm8udmFsdWUgfHwgY2FyZEluZm8uY29sb3IgPT09IENhcmREZWNrLmNvbG9yc1s0XSkge1xyXG4gICAgICAgIG9wdGlvbnNPZk1vdmUucHVzaCh0aGlzLmNhcmRzSW5IYW5kW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wdGlvbnNPZk1vdmUubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIGdldE1vdmUoY2FyZElkOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgdGhpcy5jYXJkc0luSGFuZC5zcGxpY2UodGhpcy5jYXJkc0luSGFuZC5pbmRleE9mKGNhcmRJZCksIDEpO1xyXG4gICAgcmV0dXJuIGNhcmRJZDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcclxuIiwiaW1wb3J0IENhcmREZWNrIGZyb20gJy4v0YFhcmRfZGVjayc7XHJcbmltcG9ydCBDb21wdXRlclBsYXllciBmcm9tICcuL2NvbXB1dGVyLXBsYXllcic7XHJcbmltcG9ydCB7IENhcmRJbmZvLCBDbGllbnQsIFBsYXllcnMsIFdlYlNvY2tldE1lc3NhZ2UgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XHJcbmNsYXNzIFVub0dhbWUge1xyXG4gIGRlY2s6IENhcmREZWNrO1xyXG5cclxuICBnYW1lV2lubmVyOiBzdHJpbmc7XHJcblxyXG4gIGdhbWVSZXN1bHRzOiB7IHBsYXllcjogc3RyaW5nLCB0b3RhbDogbnVtYmVyIH1bXTtcclxuXHJcbiAgcGxheWVyczogUGxheWVyc1tdID0gW107XHJcblxyXG4gIHVzZXI6IENsaWVudDtcclxuXHJcbiAgdG9wQ2FyZDogbnVtYmVyO1xyXG5cclxuICBjdXJyZW50Q29sb3I6IHN0cmluZztcclxuXHJcbiAgcmV2ZXJzZTogYm9vbGVhbjtcclxuXHJcbiAgY3VycmVudFBsYXllcklkOiBudW1iZXI7XHJcblxyXG4gIG1vdmVzQ291bnQ6IG51bWJlcjsgLy8g0YHRh9C10YLRh9C40Log0YXQvtC00L7QslxyXG5cclxuICB3ZU5vdEhhdmVBV2lubmVyOiBib29sZWFuOyAvLyDRhNC70LDQsyDQvdCw0LvQuNGH0LjRjyDQv9C+0LHQtdC00LjRgtC10LvRj1xyXG5cclxuICBjbGllbnQ6IENsaWVudDtcclxuXHJcbiAgbnVtYmVyT2ZQbGF5ZXJzOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG51bWJlck9mUGxheWVyczogbnVtYmVyLCBjbGllbnQ6IENsaWVudCkge1xyXG4gICAgdGhpcy5kZWNrID0gbmV3IENhcmREZWNrKCk7XHJcbiAgICB0aGlzLmdhbWVXaW5uZXIgPSAnJztcclxuICAgIHRoaXMuZ2FtZVJlc3VsdHMgPSBbXTtcclxuICAgIHRoaXMudXNlciA9IGNsaWVudDtcclxuICAgIHRoaXMudG9wQ2FyZCA9IDk5OTtcclxuICAgIHRoaXMuY3VycmVudENvbG9yID0gJyc7XHJcbiAgICB0aGlzLnJldmVyc2UgPSBmYWxzZTtcclxuICAgIHRoaXMuY3VycmVudFBsYXllcklkID0gMDtcclxuICAgIHRoaXMubW92ZXNDb3VudCA9IDA7XHJcbiAgICB0aGlzLndlTm90SGF2ZUFXaW5uZXIgPSB0cnVlO1xyXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XHJcbiAgICB0aGlzLm51bWJlck9mUGxheWVycyA9IG51bWJlck9mUGxheWVycztcclxuICAgIHRoaXMucGxheWVycy5wdXNoKHsgcGxheWVyOiBuZXcgUGxheWVyKGNsaWVudC51c2VyTmFtZSkgfSk7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG51bWJlck9mUGxheWVyczsgaSsrKSB7XHJcbiAgICAgIHRoaXMucGxheWVycy5wdXNoKHsgcGxheWVyOiBuZXcgQ29tcHV0ZXJQbGF5ZXIoYENvbXB1dGVyLSR7aX1gKSB9KTtcclxuICAgICAgdGhpcy5nYW1lUmVzdWx0cy5wdXNoKHsgcGxheWVyOiB0aGlzLnBsYXllcnNbaV0ucGxheWVyPy5wbGF5ZXJzTmFtZSBhcyBzdHJpbmcsIHRvdGFsOiAwIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0TmV4dFBsYXllcklEKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucmV2ZXJzZSkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50UGxheWVySWQgLSAxIDwgMCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllcklkID0gdGhpcy5wbGF5ZXJzLmxlbmd0aCAtIDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySWQtLTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllcklkICsgMSA9PT0gdGhpcy5wbGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllcklkID0gMDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXJJZCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBNb3ZlIG9mIGNvbXB1dGVyIHBsYXllciAqL1xyXG4gIGNvbXB1dGVyc01vdmUoKSB7XHJcbiAgICBsZXQgbW92ZSA9ICh0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVySWRdLnBsYXllciBhcyBDb21wdXRlclBsYXllcikuZ2V0TW92ZSh0aGlzLmRlY2ssIHRoaXMudG9wQ2FyZCwgdGhpcy5jdXJyZW50Q29sb3IpO1xyXG4gICAgaWYgKG1vdmUgPT09IDk5OSAmJiB0aGlzLmRlY2suaXNOb01vcmVDYXJkcygpKSB7XHJcbiAgICAgIHRoaXMudGFrZUNhcmRzKDEpO1xyXG4gICAgICBtb3ZlID0gKHRoaXMucGxheWVyc1t0aGlzLmN1cnJlbnRQbGF5ZXJJZF0ucGxheWVyIGFzIENvbXB1dGVyUGxheWVyKS5nZXRNb3ZlKHRoaXMuZGVjaywgdGhpcy50b3BDYXJkLCB0aGlzLmN1cnJlbnRDb2xvcik7XHJcbiAgICB9XHJcbiAgICBpZiAobW92ZSAhPT0gOTk5KSB7XHJcbiAgICAgIGNvbnN0IGNhcmRJbmZvOiBDYXJkSW5mbyA9IENhcmREZWNrLmdldENvbG9yQW5kVmFsdWUobW92ZSk7XHJcbiAgICAgIHRoaXMudG9wQ2FyZCA9IG1vdmU7XHJcbiAgICAgIGlmIChjYXJkSW5mby5jb2xvciA9PT0gQ2FyZERlY2suY29sb3JzWzRdKSB7XHJcbiAgICAgICAgdGhpcy53aWxkQ2FyZEFjdGlvbnMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IGNhcmRJbmZvLmNvbG9yO1xyXG4gICAgICAgIHRoaXMudXNlci5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IGFjdGlvbjogJ01PVkUnLCBkYXRhOiBKU09OLnN0cmluZ2lmeSh7IHRvcENhcmQ6IGNhcmRJbmZvLCBjdXJyZW50Q29sb3I6IHRoaXMuY3VycmVudENvbG9yIH0pIH0pKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY2FyZEluZm8udmFsdWUgPiA5ICYmIGNhcmRJbmZvLnZhbHVlIDwgMTMpIHtcclxuICAgICAgICB0aGlzLmZ1bkNhcmRzQWN0aW9ucygpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGVjay5kaXNjYXJkQ2FyZChtb3ZlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoYCR7KHRoaXMucGxheWVyc1t0aGlzLmN1cnJlbnRQbGF5ZXJJZF0ucGxheWVyIGFzIENvbXB1dGVyUGxheWVyKS5wbGF5ZXJzTmFtZX0gY2FudCBtb3ZlIGFuZCBza2lwIHRoZSB0dXJuIWApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogU2VuZCBtZXNzYWdlIHRvIGNsaWVudCAqL1xyXG4gIHNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy51c2VyLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uOiAnTUVTU0FHRScsIGRhdGE6IG1lc3NhZ2UgfSkpO1xyXG4gIH1cclxuXHJcbiAgLyogQ2hlY2tpbmcgdGhlIGNvcnJlY3RuZXNzIG9mIHRoZSBwbGF5ZXIncyBtb3ZlICovXHJcbiAgY2hlY2tVc2Vyc01vdmUoY2FyZElkOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGNhcmRJbmZvOiBDYXJkSW5mbyA9IENhcmREZWNrLmdldENvbG9yQW5kVmFsdWUoY2FyZElkKTtcclxuICAgIGNvbnN0IHRvcENhcmRJbmZvOiBDYXJkSW5mbyA9IENhcmREZWNrLmdldENvbG9yQW5kVmFsdWUodGhpcy50b3BDYXJkKTtcclxuICAgIGlmICh0aGlzLnRvcENhcmQgPT09IDk5OSkge1xyXG4gICAgICByZXR1cm4gIShjYXJkSW5mby5jb2xvciA9PT0gQ2FyZERlY2suY29sb3JzWzRdIHx8IGNhcmRJbmZvLnZhbHVlID4gOSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdG9wQ2FyZEluZm8uY29sb3IgPT09IENhcmREZWNrLmNvbG9yc1s0XVxyXG4gICAgICAgID8gY2FyZEluZm8uY29sb3IgPT09IHRoaXMuY3VycmVudENvbG9yIHx8IGNhcmRJbmZvLmNvbG9yID09PSBDYXJkRGVjay5jb2xvcnNbNF1cclxuICAgICAgICA6IGNhcmRJbmZvLmNvbG9yID09PSB0b3BDYXJkSW5mby5jb2xvclxyXG4gICAgICAgICAgfHwgY2FyZEluZm8udmFsdWUgPT09IHRvcENhcmRJbmZvLnZhbHVlXHJcbiAgICAgICAgICB8fCBjYXJkSW5mby5jb2xvciA9PT0gQ2FyZERlY2suY29sb3JzWzRdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyogRGlzdHJpYnV0aW9uIG9mIGNhcmRzIHRvIHRoZSBwbGF5ZXIgKi9cclxuICBkZWFsQ2FyZFRvVXNlcihxdWFudGl0eTogbnVtYmVyKTp2b2lkIHtcclxuICAgICh0aGlzLnBsYXllcnNbMF0ucGxheWVyIGFzIFBsYXllcikudGFrZUNhcmRzKHRoaXMuZGVjay5nZXRDYXJkcyhxdWFudGl0eSkpO1xyXG4gICAgKHRoaXMucGxheWVyc1swXS5wbGF5ZXIgYXMgUGxheWVyKS5nZXRZb3VyQ2FyZHMoKS5mb3JFYWNoKHZhbHVlID0+IHtcclxuICAgICAgY29uc3QgZGF0YUZvclNlbmQ6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHsgcGxheWVyOiBgcGxheWVyLSR7MX1gLCBjYXJkOiBDYXJkRGVjay5nZXRDb2xvckFuZFZhbHVlKHZhbHVlKSB9KTtcclxuICAgICAgdGhpcy51c2VyLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uOiAnR0VUX0NBUkQnLCBkYXRhOiBkYXRhRm9yU2VuZCB9KSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qIERpc3RyaWJ1dGlvbiBvZiBjYXJkcyB0byB0aGUgY29tcHV0ZXIgcGxheWVyICovXHJcbiAgZGVhbENhcmRUb0NvbXB1dGVyKHF1YW50aXR5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICh0aGlzLnBsYXllcnNbaV0ucGxheWVyIGFzIENvbXB1dGVyUGxheWVyKS50YWtlQ2FyZHModGhpcy5kZWNrLmdldENhcmRzKHF1YW50aXR5KSk7XHJcbiAgICAgICh0aGlzLnBsYXllcnNbaV0ucGxheWVyIGFzIENvbXB1dGVyUGxheWVyKS5nZXRZb3VyQ2FyZHMoKS5mb3JFYWNoKHZhbHVlID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhRm9yU2VuZDogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoeyBwbGF5ZXI6IGBwbGF5ZXItJHtpICsgMX1gLCBjYXJkOiBDYXJkRGVjay5nZXRDb2xvckFuZFZhbHVlKHZhbHVlKSB9KTtcclxuICAgICAgICB0aGlzLnVzZXIuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBhY3Rpb246ICdHRVRfQ0FSRCcsIGRhdGE6IGRhdGFGb3JTZW5kIH0pKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBQYXVzZSBpbiBtaWxsaXNlY29uZHMgKi9cclxuICBzbGVlcChtaWxsaXM6IG51bWJlcikge1xyXG4gICAgY29uc3QgdCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICB3aGlsZSAoKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLSB0KSA8IG1pbGxpcykge1xyXG4gICAgICBpKys7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBTdGFydCBvZiB0aGUgY29tcHV0ZXIgcGxheWVyJ3MgdHVybiAqL1xyXG4gIHN0YXJ0Q29tcHV0ZXJzTW92ZXMoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy53ZU5vdEhhdmVBV2lubmVyKSB7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGBNb3ZlIGJ5ICR7dGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcklkXS5wbGF5ZXI/LnBsYXllcnNOYW1lIGFzIHN0cmluZ31gKTtcclxuICAgICAgICB0aGlzLnNsZWVwKDIwMDApO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZXJzTW92ZSgpO1xyXG4gICAgICAgIHRoaXMubW92ZXNDb3VudCsrO1xyXG4gICAgICAgIHRoaXMuc2V0TmV4dFBsYXllcklEKCk7XHJcbiAgICAgICAgdGhpcy5jaGVja09uZUNhcmQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY2hlY2tXaW5uZXIoKSkge1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IHdoaWxlICh0aGlzLmN1cnJlbnRQbGF5ZXJJZCAhPT0gMCk7XHJcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoYCR7KHRoaXMucGxheWVyc1swXS5wbGF5ZXIgYXMgUGxheWVyKS5wbGF5ZXJzTmFtZX0gbW92ZSFgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qIEhhbmRsaW5nIGNhcmQgYWN0aW9uIGNoYW5nZSBkaXJlY3Rpb24sIHRha2UgKzIsIHNraXAgdHVybiAqL1xyXG4gIGZ1bkNhcmRzQWN0aW9ucygpIHtcclxuICAgIGNvbnN0IHRvcENhcmRJbmZvOiBDYXJkSW5mbyA9IENhcmREZWNrLmdldENvbG9yQW5kVmFsdWUodGhpcy50b3BDYXJkKTtcclxuICAgIGlmICh0b3BDYXJkSW5mby52YWx1ZSA9PT0gMTEpIHtcclxuICAgICAgdGhpcy5zZW5kTWVzc2FnZSgnTGV0cyByZXZlcnNlJyk7XHJcbiAgICAgIHRoaXMucmV2ZXJzZSA9ICF0aGlzLnJldmVyc2U7XHJcbiAgICB9IGVsc2UgaWYgKHRvcENhcmRJbmZvLnZhbHVlID09PSAxMiB8fCB0b3BDYXJkSW5mby52YWx1ZSA9PT0gMTApIHtcclxuICAgICAgdGhpcy5zZXROZXh0UGxheWVySUQoKTtcclxuICAgICAgaWYgKHRvcENhcmRJbmZvLnZhbHVlID09PSAxMCkge1xyXG4gICAgICAgIHRoaXMudGFrZUNhcmRzKDIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoYCR7dGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcklkXS5wbGF5ZXI/LnBsYXllcnNOYW1lIGFzIHN0cmluZ30gc2tpcHMgYSB0dXJuIWApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0YWtlQ2FyZHMocXVhbnRpdHk6IG51bWJlcikge1xyXG4gICAgc3dpdGNoIChxdWFudGl0eSkge1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShgJHt0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVySWRdLnBsYXllcj8ucGxheWVyc05hbWUgYXMgc3RyaW5nfSB0YWtlcyAke3F1YW50aXR5fSBjYXJkIWApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoYCR7dGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcklkXS5wbGF5ZXI/LnBsYXllcnNOYW1lIGFzIHN0cmluZ30gdGFrZXMgJHtxdWFudGl0eX0gY2FyZCBhbmQgc2tpcHMgYSB0dXJuIWApO1xyXG4gICAgfVxyXG4gICAgdGhpcy51c2VyLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uOiAnVVBEQVRFX0NBUkQnLCBkYXRhOiBgcGxheWVyLSR7dGhpcy5jdXJyZW50UGxheWVySWQgKyAxfWAgfSkpO1xyXG4gICAgaWYgKHRoaXMuY3VycmVudFBsYXllcklkID09PSAwKSB7XHJcbiAgICAgIHRoaXMuZGVhbENhcmRUb1VzZXIocXVhbnRpdHkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcklkXS5wbGF5ZXI/LnRha2VDYXJkcyh0aGlzLmRlY2suZ2V0Q2FyZHMocXVhbnRpdHkpKTtcclxuICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcklkXS5wbGF5ZXI/LmdldFlvdXJDYXJkcygpLmZvckVhY2godmFsdWUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGFGb3JTZW5kOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh7IHBsYXllcjogYHBsYXllci0ke3RoaXMuY3VycmVudFBsYXllcklkICsgMX1gLCBjYXJkOiBDYXJkRGVjay5nZXRDb2xvckFuZFZhbHVlKHZhbHVlKSB9KTtcclxuICAgICAgICB0aGlzLnVzZXIuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBhY3Rpb246ICdHRVRfQ0FSRCcsIGRhdGE6IGRhdGFGb3JTZW5kIH0pKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBIYW5kbGluZyB0aGUgYWN0aW9uIG9mIHdpbGQgY2FyZHMgKi9cclxuICB3aWxkQ2FyZEFjdGlvbnMoKSB7XHJcbiAgICBjb25zdCB0b3BDYXJkSW5mbzogQ2FyZEluZm8gPSBDYXJkRGVjay5nZXRDb2xvckFuZFZhbHVlKHRoaXMudG9wQ2FyZCk7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50UGxheWVySWQgPT09IDApIHtcclxuICAgICAgdGhpcy5zZW5kTWVzc2FnZSgnQ2hvb3NlIGNvbG9yIScpO1xyXG4gICAgICB0aGlzLnVzZXIuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBhY3Rpb246ICdVU0VSX01VU1RfQ0hPT1NFX0NPTE9SJywgZGF0YTogJycgfSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSAodGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcklkXS5wbGF5ZXIgYXMgQ29tcHV0ZXJQbGF5ZXIpLmNob29zZUNvbG9yKCk7XHJcbiAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoYCR7KHRoaXMucGxheWVyc1t0aGlzLmN1cnJlbnRQbGF5ZXJJZF0ucGxheWVyIGFzIENvbXB1dGVyUGxheWVyKS5wbGF5ZXJzTmFtZX0gY2hvb3NlICR7dGhpcy5jdXJyZW50Q29sb3J9IGNvbG9yIWApO1xyXG4gICAgICB0aGlzLnVzZXIuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBhY3Rpb246ICdNT1ZFJywgZGF0YTogSlNPTi5zdHJpbmdpZnkoeyB0b3BDYXJkOiB0b3BDYXJkSW5mbywgY3VycmVudENvbG9yOiB0aGlzLmN1cnJlbnRDb2xvciB9KSB9KSk7XHJcbiAgICAgIGlmICh0b3BDYXJkSW5mby52YWx1ZSA9PT0gMTQpIHtcclxuICAgICAgICB0aGlzLnNldE5leHRQbGF5ZXJJRCgpO1xyXG4gICAgICAgIHRoaXMudGFrZUNhcmRzKDQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBIYW5kbGluZyBnYW1lIGVuZCBhY3Rpb25zICovXHJcbiAgc3RvcEdhbWUoKTogdm9pZCB7XHJcbiAgICBjb25zdCByb3VuZFJlc3VsdDogeyBwbGF5ZXI6IHN0cmluZywgdG90YWw6IG51bWJlciB9ID0gdGhpcy5jYWxjdWxhdGVQb2ludHMoKTtcclxuICAgIHRoaXMuZ2FtZVJlc3VsdHMuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcbiAgICAgIGlmIChyb3VuZFJlc3VsdC5wbGF5ZXIgPT09IHZhbHVlLnBsYXllcikge1xyXG4gICAgICAgIHZhbHVlLnRvdGFsICs9IHJvdW5kUmVzdWx0LnRvdGFsO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b3RhbCA+PSAyNTApIHtcclxuICAgICAgICAgIHRoaXMuZ2FtZVdpbm5lciA9IHZhbHVlLnBsYXllcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKHRoaXMuZ2FtZVdpbm5lciAhPT0gJycpIHtcclxuICAgICAgdGhpcy5zZW5kTWVzc2FnZShgJHt0aGlzLmdhbWVXaW5uZXJ9IHdpbiB0aGUgZ2FtZSFgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGVjayA9IG5ldyBDYXJkRGVjaygpO1xyXG4gICAgICB0aGlzLnRvcENhcmQgPSA5OTk7XHJcbiAgICAgIHRoaXMuY3VycmVudENvbG9yID0gJyc7XHJcbiAgICAgIHRoaXMucmV2ZXJzZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmN1cnJlbnRQbGF5ZXJJZCA9IDA7XHJcbiAgICAgIHRoaXMubW92ZXNDb3VudCA9IDA7XHJcbiAgICAgIHRoaXMud2VOb3RIYXZlQVdpbm5lciA9IHRydWU7XHJcbiAgICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHZhbHVlID0+IHZhbHVlLnBsYXllcj8uY2xlYXJEZWNrKCkpO1xyXG4gICAgICB0aGlzLnNsZWVwKDUwMDApO1xyXG4gICAgICB0aGlzLnVzZXIuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBhY3Rpb246ICdDTEVBUl9GSUVMRCcsIGRhdGE6ICcnIH0pKTtcclxuICAgICAgdGhpcy5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qIFNjb3JpbmcgYXQgdGhlIGVuZCBvZiB0aGUgcm91bmQgKi9cclxuICBjYWxjdWxhdGVQb2ludHMoKTogeyBwbGF5ZXI6IHN0cmluZywgdG90YWw6IG51bWJlciB9IHtcclxuICAgIGNvbnN0IHJlc3VsdHM6IHsgcGxheWVyOiBzdHJpbmcsIHBvaW50czogbnVtYmVyIH1bXSA9IFtdO1xyXG4gICAgY29uc3QgdG90YWw6IHsgcGxheWVyOiBzdHJpbmcsIHRvdGFsOiBudW1iZXIgfSA9IHsgcGxheWVyOiAnJywgdG90YWw6IDAgfTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHVzZXJSZXN1bHQ6IHsgcGxheWVyOiBzdHJpbmcsIHBvaW50czogbnVtYmVyIH0gPSB7IHBsYXllcjogdGhpcy5wbGF5ZXJzW2ldLnBsYXllcj8ucGxheWVyc05hbWUgYXMgc3RyaW5nLCBwb2ludHM6IDAgfTtcclxuICAgICAgdGhpcy5wbGF5ZXJzW2ldLnBsYXllcj8uZ2V0WW91ckNhcmRzKCkuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FyZEluZm86IENhcmRJbmZvID0gQ2FyZERlY2suZ2V0Q29sb3JBbmRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgc3dpdGNoIChjYXJkSW5mby52YWx1ZSkge1xyXG4gICAgICAgICAgY2FzZSAxMyB8fCAxNDoge1xyXG4gICAgICAgICAgICB1c2VyUmVzdWx0LnBvaW50cyArPSA1MDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIDEwIHx8IDExIHx8IDEyOiB7XHJcbiAgICAgICAgICAgIHVzZXJSZXN1bHQucG9pbnRzICs9IDIwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgdXNlclJlc3VsdC5wb2ludHMgKz0gY2FyZEluZm8udmFsdWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJlc3VsdHMucHVzaCh1c2VyUmVzdWx0KTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgdXMgb2YgcmVzdWx0cykge1xyXG4gICAgICBpZiAodXMucG9pbnRzID09PSAwKSB7XHJcbiAgICAgICAgdG90YWwucGxheWVyID0gdXMucGxheWVyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRvdGFsLnRvdGFsICs9IHVzLnBvaW50cztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51c2VyLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uOiAnUkVTVUxUU19PRl9ST1VORCcsIGRhdGE6IEpTT04uc3RyaW5naWZ5KHJlc3VsdHMpIH0pKTtcclxuICAgIHJldHVybiB0b3RhbDtcclxuICB9XHJcblxyXG4gIC8qIENoZWNraW5nIGlmIHRoZXJlIGlzIGEgd2lubmVyICovXHJcbiAgY2hlY2tXaW5uZXIoKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5wbGF5ZXJzLmZpbHRlcih2YWx1ZSA9PiB7IHJldHVybiB2YWx1ZS5wbGF5ZXI/LmdldE51bWJlck9mQ2FyZHNJbkhhbmQoKSA9PT0gMDt9KS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgdGhpcy5zZW5kTWVzc2FnZShgJHt0aGlzLnBsYXllcnMuZmlsdGVyKHZhbHVlID0+IHsgcmV0dXJuIHZhbHVlLnBsYXllcj8uZ2V0TnVtYmVyT2ZDYXJkc0luSGFuZCgpID09PSAwO30pWzBdLnBsYXllcj8ucGxheWVyc05hbWUgYXMgc3RyaW5nfSBpcyB3aW4gdGhpcyByb3VuZCFgKTtcclxuICAgICAgdGhpcy5zdG9wR2FtZSgpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qIFByZXNzaW5nIHRoZSBVbm8gQnV0dG9uICovXHJcbiAgcHVzaFVub0J1dHRvbigpIHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51c2VyLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uOiAnUFVTSF9VTk9fQlVUVE9OJywgZGF0YTogJycgfSkpLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNzAwMCAtIDEwMDAgKyAxKSArIDEwMDApKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qIENoZWNraW5nIGlmIG9uZSBjYXJkIGlzIGluIGhhbmQgKi9cclxuICBjaGVja09uZUNhcmQoKSB7XHJcbiAgICBpZiAodGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcklkXS5wbGF5ZXI/LmdldE51bWJlck9mQ2FyZHNJbkhhbmQoKSA9PT0gMSkge1xyXG4gICAgICB0aGlzLnB1c2hVbm9CdXR0b24oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qIExhdW5jaGluZyB0aGUgc3RhcnQgb2YgdGhlIGdhbWUgKi9cclxuICBzdGFydEdhbWUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRlYWxDYXJkVG9Vc2VyKDcpO1xyXG4gICAgdGhpcy5kZWFsQ2FyZFRvQ29tcHV0ZXIoNyk7XHJcbiAgICB0aGlzLnNlbmRNZXNzYWdlKGBNb3ZlIGJ5ICR7dGhpcy5wbGF5ZXJzWzBdLnBsYXllcj8ucGxheWVyc05hbWUgYXMgc3RyaW5nfWApO1xyXG4gICAgdGhpcy51c2VyLnNvY2tldC5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4ge1xyXG4gICAgICBjb25zdCBtZXMgPSBKU09OLnBhcnNlKG1lc3NhZ2UudG9TdHJpbmcoKSkgYXMgV2ViU29ja2V0TWVzc2FnZTtcclxuICAgICAgc3dpdGNoIChtZXMuYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSAnTU9WRV9CWV9VU0VSJzoge1xyXG4gICAgICAgICAgaWYgKHRoaXMud2VOb3RIYXZlQVdpbm5lcikge1xyXG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gSlNPTi5wYXJzZShtZXMuZGF0YSkgYXMgeyB1c2VyTmFtZTogc3RyaW5nLCBjYXJkSWQ6IHN0cmluZyB9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja1VzZXJzTW92ZShwYXJzZUludChtb3ZlLmNhcmRJZCkpKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50b3BDYXJkID0gKHRoaXMucGxheWVyc1swXS5wbGF5ZXIgYXMgUGxheWVyKS5nZXRNb3ZlKHBhcnNlSW50KG1vdmUuY2FyZElkKSk7XHJcbiAgICAgICAgICAgICAgY29uc3QgY2FyZEluZm86IENhcmRJbmZvID0gQ2FyZERlY2suZ2V0Q29sb3JBbmRWYWx1ZSh0aGlzLnRvcENhcmQpO1xyXG4gICAgICAgICAgICAgIGlmIChjYXJkSW5mby5jb2xvciA9PT0gQ2FyZERlY2suY29sb3JzWzRdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbGRDYXJkQWN0aW9ucygpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IGNhcmRJbmZvLmNvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uOiAnTU9WRScsIGRhdGE6IEpTT04uc3RyaW5naWZ5KHsgdG9wQ2FyZDogY2FyZEluZm8sIGN1cnJlbnRDb2xvcjogdGhpcy5jdXJyZW50Q29sb3IgfSkgfSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWNrLmRpc2NhcmRDYXJkKHRoaXMudG9wQ2FyZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVzQ291bnQrKztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGNhcmRJbmZvLnZhbHVlID4gOSAmJiBjYXJkSW5mby52YWx1ZSA8IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5DYXJkc0FjdGlvbnMoKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0aGlzLnNldE5leHRQbGF5ZXJJRCgpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Q29tcHV0ZXJzTW92ZXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSgnV3JvbmcgbW92ZSEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ0dFVF9DQVJEX0JZX1VTRVInOiB7XHJcbiAgICAgICAgICBpZiAoKHRoaXMucGxheWVyc1swXS5wbGF5ZXIgYXMgUGxheWVyKS5zZWxlY3RQb3NzaWJsZU9wdGlvbnNGb3JNb3ZlKHRoaXMudG9wQ2FyZCwgdGhpcy5jdXJyZW50Q29sb3IpIHx8IHRoaXMudG9wQ2FyZCA9PT0gOTk5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoJ1lvdSBoYXZlIG9wdGlvbnMgZm9yIG1vdmUhJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXIuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBhY3Rpb246ICdVUERBVEVfQ0FSRCcsIGRhdGE6IGBwbGF5ZXItJHsxfWAgfSkpO1xyXG4gICAgICAgICAgICB0aGlzLmRlYWxDYXJkVG9Vc2VyKDEpO1xyXG4gICAgICAgICAgICBpZiAoISh0aGlzLnBsYXllcnNbMF0ucGxheWVyIGFzIFBsYXllcikuc2VsZWN0UG9zc2libGVPcHRpb25zRm9yTW92ZSh0aGlzLnRvcENhcmQsIHRoaXMuY3VycmVudENvbG9yKSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0TmV4dFBsYXllcklEKCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSgnWW91IGNhbnQgb3B0aW9ucyBmb3IgbW92ZSEgWW91IHNraXAgdGhlIHR1cm4hJyk7XHJcbiAgICAgICAgICAgICAgdGhpcy5zdGFydENvbXB1dGVyc01vdmVzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdHRVRfVVNFUlNfTElTVCc6IHtcclxuICAgICAgICAgIGNvbnN0IHVzZXJzTmFtZTogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgIHRoaXMucGxheWVycy5mb3JFYWNoKHBsYXllcnMgPT4gdXNlcnNOYW1lLnB1c2gocGxheWVycy5wbGF5ZXI/LnBsYXllcnNOYW1lIGFzIHN0cmluZykpO1xyXG4gICAgICAgICAgdGhpcy51c2VyLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uOiAnU0VUX1VTRVJTX0xJU1QnLCBkYXRhOiBKU09OLnN0cmluZ2lmeSh1c2Vyc05hbWUpIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdVU0VSU19TRUxFQ1RFRF9DT0xPUic6IHtcclxuICAgICAgICAgIHRoaXMuY3VycmVudENvbG9yID0gbWVzLmRhdGE7XHJcbiAgICAgICAgICBjb25zdCBjYXJkSW5mbzogQ2FyZEluZm8gPSBDYXJkRGVjay5nZXRDb2xvckFuZFZhbHVlKHRoaXMudG9wQ2FyZCk7XHJcbiAgICAgICAgICB0aGlzLnVzZXIuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBhY3Rpb246ICdNT1ZFJywgZGF0YTogSlNPTi5zdHJpbmdpZnkoeyB0b3BDYXJkOiBjYXJkSW5mbywgY3VycmVudENvbG9yOiB0aGlzLmN1cnJlbnRDb2xvciB9KSB9KSk7XHJcbiAgICAgICAgICBpZiAoY2FyZEluZm8udmFsdWUgPT09IDE0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV4dFBsYXllcklEKCk7XHJcbiAgICAgICAgICAgIHRoaXMudGFrZUNhcmRzKDQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllcklkICsgMSA+PSB0aGlzLnBsYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllcklkID0gMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV4dFBsYXllcklEKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxheWVySWQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRDb21wdXRlcnNNb3ZlcygpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVW5vR2FtZTtcclxuIiwiaW1wb3J0IHsgQ2FyZEluZm8gfSBmcm9tICcuL3R5cGVzJztcclxuLyogR2VuZXJhdGVzIGEgZGVjayBvZiBjYXJkcyB0byBwbGF5IFVuby5cclxuICAgVGhlcmUgYXJlIDEwOCBjYXJkcyBpbiBhIGRlY2ssIGVhY2ggY2FyZCBoYXMgaXRzIG93biBzZXJpYWwgbnVtYmVyIGZyb20gMCB0byAxMDcuXHJcbiAgICAtIGNhcmRzIG9mIDQgY29sb3JzOiBibHVlLCB5ZWxsb3csIHJlZCwgZ3JlZW5cclxuICAgICAgd2l0aCBudW1iZXJzIGZyb20gXCIwXCIgdG8gXCI5XCIgKDIgY2FyZHMgZnJvbSBcIjFcIiB0byBcIjlcIiBmb3IgZWFjaCBjb2xvciBhbmQgMSBjYXJkIFwiMFwiLiBUb3RhbCAtIDc2IGNhcmRzKSA7XHJcbiAgICAtIGNhcmRzIHdpdGggYWN0aW9ucyAoMiBmb3IgZWFjaCBjb2xvcik6IFwiVGFrZSB0d29cIiwgXCJNb3ZlIGJhY2tcIiwgXCJTa2lwIHRoZSBtb3ZlXCIgKDI0IGNhcmRzIGluIHRvdGFsKTtcclxuICAgIC0gYWN0aW9uIGNhcmRzICh3aWxkIGNhcmRzKTogXCJDaG9vc2UgYSBjb2xvclwiLCBcIkNob29zZSBhIGNvbG9yIGFuZCB0YWtlIDRcIiAodG90YWwgLSA4IGNhcmRzKTsgKi9cclxuY2xhc3MgQ2FyZERlY2sge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVjazogbnVtYmVyW107XHJcblxyXG4gIHByaXZhdGUgdXNlcnNDYXJkczogbnVtYmVyW107XHJcblxyXG4gIHByaXZhdGUgZGlzY2FyZGVkQ2FyZHM6IG51bWJlcltdO1xyXG5cclxuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IGNvbG9yczpzdHJpbmdbXSA9IFsnYmx1ZScsICdncmVlbicsICdyZWQnLCAneWVsbG93JywgJ2JsYWNrJ107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kZWNrID0gWy4uLkFycmF5KDEwOCkua2V5cygpXS5tYXAoaSA9PiBpKyspO1xyXG4gICAgdGhpcy51c2Vyc0NhcmRzID0gW107XHJcbiAgICB0aGlzLmRpc2NhcmRlZENhcmRzID0gW107XHJcbiAgICB0aGlzLnNodWZmbGVEZWNrKCk7XHJcbiAgfVxyXG5cclxuICAvKiBTaHVmZmxlcyBhIGRlY2sgb2YgY2FyZHMgKi9cclxuICBzaHVmZmxlRGVjaygpOiB2b2lkIHtcclxuICAgIHRoaXMuZGVjay5zb3J0KCgpID0+IE1hdGgucmFuZG9tKCkgLSAwLjUpLnNvcnQoKCkgPT4gTWF0aC5yYW5kb20oKSAtIDAuNSk7XHJcbiAgfVxyXG5cclxuICAvKiByZXR1cm5zIGFuIGFycmF5IHdpdGggY2FyZCBudW1iZXJzLiBJZiB0aGUgZGVjayBydW5zIG91dCBvZiBjYXJkcyxcclxuICB0aGVuIGhlIHRha2VzIHRoZSBjYXJkcyBhbmQgdGhlIGRpc2NhcmRlZCBhcnJheSwgYWRkcyB0aGVtIHRvIHRoZVxyXG4gIGRlY2sgYW5kIHNodWZmbGVzIHRoZW0uIFRoZSBkaXNjYXJkZWQgY2FyZHMgYXJlIGxlZnQgd2l0aCAxIHRvcCBjYXJkLiAqL1xyXG4gIGdldENhcmRzKHF1YW50aXR5ID0gMSk6IG51bWJlcltdIHtcclxuICAgIGlmICh0aGlzLmRlY2subGVuZ3RoID09PSAwICYmIHRoaXMuZGlzY2FyZGVkQ2FyZHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJldHVybmVkQ2FyZEFycmF5OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWFudGl0eTsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmRlY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybmVkQ2FyZEFycmF5LnB1c2godGhpcy5kZWNrLnBvcCgpIGFzIG51bWJlcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzY2FyZGVkQ2FyZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY29uc3QgdG9wQ2FyZCA9IHRoaXMuZGlzY2FyZGVkQ2FyZHMucG9wKCk7XHJcbiAgICAgICAgICB0aGlzLmRlY2sucHVzaCguLi50aGlzLmRpc2NhcmRlZENhcmRzKTtcclxuICAgICAgICAgIHRoaXMuZGlzY2FyZGVkQ2FyZHMgPSBbdG9wQ2FyZCBhcyBudW1iZXJdO1xyXG4gICAgICAgICAgdGhpcy5zaHVmZmxlRGVjaygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gbW9yZSBjYXJkcyEnKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51c2Vyc0NhcmRzLnB1c2goLi4ucmV0dXJuZWRDYXJkQXJyYXkpO1xyXG4gICAgcmV0dXJuIHJldHVybmVkQ2FyZEFycmF5O1xyXG4gIH1cclxuXHJcbiAgLyogUGxhY2VzIGEgY2FyZCBpbiB0aGUgZGlzY2FyZCBwaWxlICovXHJcbiAgZGlzY2FyZENhcmQoY2FyZElkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudXNlcnNDYXJkcy5zcGxpY2UodGhpcy51c2Vyc0NhcmRzLmluZGV4T2YoY2FyZElkKSwgMSk7XHJcbiAgICB0aGlzLmRpc2NhcmRlZENhcmRzLnB1c2goY2FyZElkKTtcclxuICB9XHJcblxyXG4gIC8qIFJldHVybnMgdGhlIGNvbG9yIGFuZCB2YWx1ZSBvZiB0aGUgY2FyZCAqL1xyXG4gIHN0YXRpYyBnZXRDb2xvckFuZFZhbHVlKGNhcmRJZDogbnVtYmVyKTogQ2FyZEluZm8ge1xyXG4gICAgY29uc3QgY2FyZEluZm86IENhcmRJbmZvID0geyBpZDogY2FyZElkLCBjb2xvcjogQ2FyZERlY2suY29sb3JzW01hdGguZmxvb3IoY2FyZElkIC8gMjUpXSwgdmFsdWU6IDAgfTtcclxuICAgIGlmIChjYXJkSWQgPCAxMDApIHtcclxuICAgICAgaWYgKGNhcmRJZCAlIDI1IDwgMTkpIHtcclxuICAgICAgICBjYXJkSW5mby52YWx1ZSA9IGNhcmRJZCAlIDI1IDwgMTAgPyBjYXJkSWQgJSAyNSA6ICgoY2FyZElkICUgMjUpICUgMTApICsgMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYXJkSW5mby52YWx1ZSA9IGNhcmRJZCAlIDI1IDwgMjEgPyAxMCA6IGNhcmRJZCAlIDI1IDwgMjMgPyAxMSA6IDEyO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYXJkSW5mby52YWx1ZSA9IGNhcmRJZCA8IDEwNCA/IDEzIDogMTQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2FyZEluZm87XHJcbiAgfVxyXG5cclxuICAvKiBDaGVja3MgaWYgdGhlcmUgYXJlIGNhcmRzIHRvIGlzc3VlXHJcbiAgKiAndHJ1ZScgaWYgdGhlcmUgYXJlIGNhcmRzLFxyXG4gICogJ2ZhbHNlJyBpZiB0aGVyZSBhcmUgbm8gY2FyZHMgKi9cclxuICBpc05vTW9yZUNhcmRzKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZGVkQ2FyZHMubGVuZ3RoID4gMCB8fCB0aGlzLmRlY2subGVuZ3RoID4gMDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhcmREZWNrO1xyXG4iLCJpbXBvcnQgV2Vic29ja2V0U2VydmVyIGZyb20gJy4vd2Vic29ja2V0JztcclxuaW1wb3J0IHsgYXBwIH0gZnJvbSAnLi9leHByZXNzJztcclxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcclxuY29uc3Qgd3NzID0gbmV3IFdlYnNvY2tldFNlcnZlcig5MDAxKTtcclxud3NzLnN0YXJ0KCk7XHJcbmFwcC5saXN0ZW4oOTAwMiwgKCk9PmNvbnNvbGUubG9nKGNoYWxrLmJnQ3lhbign0KHQtdGA0LLQtdGAINC30LDQv9GD0YnQtdC9Li4uJykpKTtcclxuIiwiaW1wb3J0IFdlYlNvY2tldCBmcm9tICd3cyc7XHJcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSAnaHR0cCc7XHJcbmltcG9ydCB7IENsaWVudCwgQ3JlYXRlR2FtZU1lc3NhZ2UsIEdhbWUsIFdlYlNvY2tldE1lc3NhZ2UgfSBmcm9tICcuL2dhbWUvdHlwZXMnO1xyXG5pbXBvcnQgVW5vR2FtZSBmcm9tICcuL2dhbWUvdW5vLWdhbWUnO1xyXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5cclxuY2xhc3MgV2Vic29ja2V0U2VydmVyIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IHdzOiBXZWJTb2NrZXQuU2VydmVyPFdlYlNvY2tldD47XHJcblxyXG4gIHVucmVnaXN0ZXJlZFVzZXJzQ291bnRlcjogbnVtYmVyO1xyXG5cclxuICBwcml2YXRlIGNsaWVudHM6IENsaWVudFtdID0gW107XHJcblxyXG4gIHByaXZhdGUgZ2FtZXM6IEdhbWVbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwb3J0OiBudW1iZXIpIHtcclxuICAgIHRoaXMudW5yZWdpc3RlcmVkVXNlcnNDb3VudGVyID0gMDtcclxuICAgIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKChyZXEsIHJlcykgPT4ge1xyXG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XHJcbiAgICAgIHJlcy5lbmQoJ2luZGV4Lmh0bWwnKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQuU2VydmVyKHsgc2VydmVyIH0pO1xyXG4gICAgc2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmJnQ3lhbihgTGlzdGVuIHBvcnQgJHtwb3J0fWApKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29ubmVjdGlvbk9uQ2xvc2UoY29ubmVjdGlvbjogV2ViU29ja2V0KSB7XHJcbiAgICBjb25uZWN0aW9uLm9uKCdjbG9zZScsICgpID0+IHtcclxuICAgICAgY29uc3QgY2xpZW50OiBDbGllbnQgPSB0aGlzLmNsaWVudHMuZmlsdGVyKHZhbHVlID0+IHtcclxuICAgICAgICByZXR1cm4gdmFsdWUuc29ja2V0ID09PSBjb25uZWN0aW9uO1xyXG4gICAgICB9KVswXTtcclxuICAgICAgY29uc29sZS5sb2coY2hhbGsuYmdSZWRCcmlnaHQoYCR7Y2xpZW50LnVzZXJOYW1lfSBpcyBkaXNjb25uZWN0ZWQhYCkpO1xyXG4gICAgICB0aGlzLmNsaWVudHMgPSB0aGlzLmNsaWVudHMuZmlsdGVyKHZhbHVlID0+IHtcclxuICAgICAgICByZXR1cm4gdmFsdWUuc29ja2V0ICE9PSBjb25uZWN0aW9uO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZENsaWVudChjb25uZWN0aW9uOiBXZWJTb2NrZXQpOiBDbGllbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIodmFsdWUgPT4ge1xyXG4gICAgICByZXR1cm4gdmFsdWUuc29ja2V0ID09PSBjb25uZWN0aW9uO1xyXG4gICAgfSlbMF07XHJcbiAgfVxyXG5cclxuICBjb25uZWN0aW9uT25NZXNzYWdlKGNvbm5lY3Rpb246IFdlYlNvY2tldCkge1xyXG4gICAgY29ubmVjdGlvbi5vbignbWVzc2FnZScsIChtZXNzYWdlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UobWVzc2FnZS50b1N0cmluZygpKSBhcyBXZWJTb2NrZXRNZXNzYWdlO1xyXG4gICAgICBzd2l0Y2ggKG1zZy5hY3Rpb24pIHtcclxuICAgICAgICBjYXNlICdDUkVBVEVfR0FNRSc6IHtcclxuICAgICAgICAgIGNvbnN0IHNldHRpbmdzOiBDcmVhdGVHYW1lTWVzc2FnZSA9IEpTT04ucGFyc2UobXNnLmRhdGEpIGFzIENyZWF0ZUdhbWVNZXNzYWdlO1xyXG4gICAgICAgICAgY29uc3QgbmV3R2FtZTogR2FtZSA9IHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2FtZXMubGVuZ3RoICsgMSxcclxuICAgICAgICAgICAgZ2FtZTogbmV3IFVub0dhbWUoc2V0dGluZ3MucGxheWVycywgdGhpcy5maW5kQ2xpZW50KGNvbm5lY3Rpb24pKSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLmdhbWVzLnB1c2gobmV3R2FtZSk7XHJcbiAgICAgICAgICBuZXdHYW1lLmdhbWUuc3RhcnRHYW1lKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnV0hBVFNfTVlfTkFNRSc6IHtcclxuICAgICAgICAgIGNvbm5lY3Rpb24uc2VuZChKU09OLnN0cmluZ2lmeSh7IGFjdGlvbjogJ1lPVVJfTkFNRScsIGRhdGE6IHRoaXMuZmluZENsaWVudChjb25uZWN0aW9uKS51c2VyTmFtZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnVVBEQVRFX05BTUUnOiB7XHJcbiAgICAgICAgICB0aGlzLmNsaWVudHMuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zb2NrZXQgPT09IGNvbm5lY3Rpb24pIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5iZ0JsdWUoYFVzZXIgJHt2YWx1ZS51c2VyTmFtZX0gdXBkYXRlIG5pY2tuYW1lIG9uICR7bXNnLmRhdGF9YCkpO1xyXG4gICAgICAgICAgICAgIHZhbHVlLnVzZXJOYW1lID0gbXNnLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJ0NIQVRfTUVTU0FHRSc6IHtcclxuICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgY29uc3QgdXNlclNheSA9IHRoaXMuY2xpZW50cy5maWx0ZXIodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuc29ja2V0ID09PSBjb25uZWN0aW9uO1xyXG4gICAgICAgICAgfSlbMF0udXNlck5hbWU7XHJcbiAgICAgICAgICB0aGlzLmNsaWVudHMuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIHZhbHVlLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0lOQ09NRV9DSEFUX01FU1NBR0UnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyOiB1c2VyU2F5LFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJNZXNzYWdlOiBtc2cuZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBgJHtkYXRlLmdldEhvdXJzKCkgPCAxMCA/ICcwJy5jb25jYXQoZGF0ZS5nZXRIb3VycygpLnRvU3RyaW5nKCkpIDogZGF0ZS5nZXRIb3VycygpfToke2RhdGUuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcuY29uY2F0KGRhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkpIDogZGF0ZS5nZXRNaW51dGVzKCl9OiR7ZGF0ZS5nZXRTZWNvbmRzKCkgPCAxMCA/ICcwJy5jb25jYXQoZGF0ZS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKSkgOiBkYXRlLmdldFNlY29uZHMoKX1gLFxyXG4gICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdGFydCgpIHtcclxuICAgIHRoaXMud3Mub24oJ2Nvbm5lY3Rpb24nLCAoY29ubmVjdGlvbikgPT4ge1xyXG4gICAgICB0aGlzLnVucmVnaXN0ZXJlZFVzZXJzQ291bnRlcisrO1xyXG4gICAgICBjb25zdCBjbGllbnQ6IENsaWVudCA9IHsgc29ja2V0OiBjb25uZWN0aW9uLCB1c2VyTmFtZTogYFVzZXItJHt0aGlzLnVucmVnaXN0ZXJlZFVzZXJzQ291bnRlcn1gIH07XHJcbiAgICAgIHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmJnWWVsbG93KGBOZXcgdXNlciAke2NsaWVudC51c2VyTmFtZX0gaXMgY29ubmVjdGVkIWApKTtcclxuICAgICAgdGhpcy5jb25uZWN0aW9uT25DbG9zZShjb25uZWN0aW9uKTtcclxuICAgICAgdGhpcy5jb25uZWN0aW9uT25NZXNzYWdlKGNvbm5lY3Rpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXZWJzb2NrZXRTZXJ2ZXI7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoYWxrXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvb2tpZS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3FsaXRlM1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ3c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvc2VydmVyLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9