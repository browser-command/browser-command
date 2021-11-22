import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import path from 'path';
import { Packet, World } from '@browser-command/core';

const client = path.join(require.resolve('@browser-command/client'), '../../dist');

const { app } = expressWs(express());

app.use(cors());

app.use(express.static(client));

function toBinaryString(buf: Buffer): string {
	const result = [];
	for (const b of buf) {
		result.push(b.toString(2).padStart(8, '0'));
	}
	return result.join(' ');
}

app.ws('/', (ws, req) => {
	console.log('open');

	ws.on('message', (msg) => {
		if (msg instanceof Buffer) {
			const packet = new Packet(msg);
			console.log(packet.readInt());
			console.log(packet.readBoolean());
		}
	});
});

console.log('listening on port 3000');
app.listen(process.env.PORT || 3000);

export class Server {
	public world: World = new World();
}
