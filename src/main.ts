import http from 'http';
import koa from 'koa';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import { Server } from 'socket.io';
import { PORT, DEALY_TIMEOUT } from './config/constants';

import apiRoute from './api/route';
import InscriptionController from './api/controllers/InscriptionController'

const app = new koa();
app.use(bodyParser())
app.use(cors({
    origin: '*'
}))
app.use(apiRoute.routes())

const httpServer = http.createServer(app.callback())
const io = new Server(httpServer)

io.on('connection', async (socket: any) => {
    console.log(`New user connected with id ${socket.id}`);
    
    socket.on('disconnect', () => {
        clearInterval(timeInterval);
        console.log(`User disconnected with id ${socket.id}`);
    });

    let timeInterval: ReturnType<typeof setTimeout>;

    socket.on('getinscription', (data: any) => {
        clearInterval(timeInterval);

        //
        var currentBlockId = data.block_id;
        var contentType = data.content_type;
        var transfer = data.transfer
        
        const startTimer = async () => {
            
            const result = await InscriptionController.getInscriptionFromSock(currentBlockId, contentType, transfer)

            if (result != 'no new block') {
                currentBlockId += 1
            }

            socket.emit('sendInscription', result)

        }

        startTimer()

        timeInterval = setInterval(() => {
            startTimer()
        }, DEALY_TIMEOUT)
    })
    

    if (socket.request._query['contentType']) {
        const contentType = socket.request._query['contentType']
        const result = await InscriptionController.getInscriptionByContentType(contentType)

    }


});


httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});