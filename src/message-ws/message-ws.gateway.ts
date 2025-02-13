import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService

  ) { }

  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);

    } catch (error) {
      console.log(error);
      client.disconnect();
      return;
    }
    console.log({ payload });

    // console.log("Cliente conectado", client.id);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    // console.log("Cliente desconectado", client.id);
    this.messageWsService.removeClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {


    // ! Recibe el mensaje el que lo emite

    // client.emit("mesagge-from-server", { fullName: "Soy yo!!", message: payload.message || "no-message" });

    // ! Emitir a TODOS, menos al cliente:client

    // client.broadcast.emit("mesagge-from-server", { fullName: "Soy yo!!", message: payload.message || "no-message" });

    // ! Reciben todos. Inclusive el que emite el mensaje

    this.wss.emit("mesagge-from-server", {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || "no-message"
    });

  }


}
