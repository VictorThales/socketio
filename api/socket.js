const { Server } = require('socket.io');
const { createServer } = require('http');

let io;

module.exports = (req, res) => {
    if (!io) {
        const httpServer = createServer();

        io = new Server(httpServer, {
            cors: {
                origin: '*', // Altere para restringir origens em produção
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('Usuário conectado:', socket.id);

            socket.on('message', (data) => {
                console.log('Mensagem recebida:', data);
                socket.emit('response', `Servidor recebeu: ${data}`);
            });

            socket.on('disconnect', () => {
                console.log('Usuário desconectado:', socket.id);
            });
        });

        res.socket.server.on('upgrade', (request, socket, head) => {
            httpServer.emit('upgrade', request, socket, head);
        });

        res.socket.server.io = io;
    }

    res.end(); // Necessário para finalizar a requisição HTTP
};
