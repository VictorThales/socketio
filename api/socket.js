const { Server } = require('socket.io');
const { createServer } = require('http');

let io;

const handler = (req, res) => {
    if (!io) {
        const server = createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ "websocket test": "1.0" }));
        });

        io = new Server(server);

        // Configuração do Socket.IO
        io.on('connection', (socket) => {
            console.log('Usuário conectado!', socket.id);

            socket.on('disconnect', (reason) => {
                console.log('Usuário desconectado!', socket.id);
            });

            socket.on('set_username', (username) => {
                socket.data.username = username;
            });

            socket.on('message', (text) => {
                io.emit('receive_message', {
                    text,
                    authorId: socket.id,
                    author: socket.data.username || 'Anônimo',
                });
            });
        });

        server.listen(3000, () => {
            console.log('Socket.IO Server rodando na porta 3000');
        });
    }

    res.end(); // Responde à função serverless da Vercel
};

module.exports = handler;