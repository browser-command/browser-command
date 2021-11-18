import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import path from 'path';
import { World } from '@browser-command/core';

const client = path.join(require.resolve('@browser-command/client'), '../../dist');

const { app } = expressWs(express());

app.use(cors());

app.use(express.static(client));

app.ws('/', (ws, req) => {
	console.log('open');

	ws.on('message', (msg) => {
		console.log(msg);
	});
});

console.log('listening on port 3000');
app.listen(process.env.PORT || 3000);

export class Server {
	public world: World = new World();
}
