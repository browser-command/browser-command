import express from 'express';
import cors from 'cors';
import path from 'path';

import socket from 'socket.io';
import { Server } from './Server';

const client = path.join(require.resolve('@browser-command/client'), '../../dist');

console.log(client);

const app = express();
app.use(cors());
app.use(express.static(client));

const port = process.env.PORT || 3000;

const handler = app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
const io = new socket.Server(handler);

const host = new Server(io);

host.start();
