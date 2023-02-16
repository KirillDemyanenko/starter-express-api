// import WebSocket from 'ws';
// import * as http from 'http';
// const server = http.createServer((req, res) => {
//   res.writeHead(200);
//   res.end('index.html');
// });
//
// server.listen(9001, () => {
//   console.log('Listen port 9001');
// });
//
// const ws = new WebSocket.Server({ server });
// ws.on('connection', (connection, req) => {
//   const ip = req.socket.remoteAddress;
//   console.log(`Connected ${ip as string}`);
//   connection.on('message', (message) => {
//     // console.log('Received: ' + message);
//     for (const client of ws.clients) {
//       if (client.readyState !== WebSocket.OPEN) continue;
//       //if (client === connection) continue;
//       const mes = `
//             <div class="container">
//               <img src="https://html5css.ru/w3images/bandmember.jpg" alt="Avatar" style="width:100%;">
//               <p>${message.toString()}</p>
//               <span class="time-right">11:02</span>
//             </div>`;
//       client.send(mes, { binary: false });
//     }
//   });
//   connection.on('close', () => {
//     // console.log(`Disconnected ${ip.toString() }`);
//   });
// });
