import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import path from 'path';

console.log(path.join(require.resolve('@browser-command/client'), '.'));

const { app } = expressWs(express());

app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World 2!');
});

app.ws('/', (ws, req) => {
	console.log('open');

	ws.on('message', (msg) => {
		console.log(msg);
	});
});

console.log('listening on port 3000');
app.listen(process.env.PORT || 3000);

export const server = app;
