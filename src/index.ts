import dotenv from 'dotenv';
dotenv.config();
import { transporter } from './config/nodemailer';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// for google authentication
import session from 'express-session';
import passport from 'passport';
import './config/GooglePassport';
import swaggerUi from 'swagger-ui-express';
import http from 'http';
import routes from './routes';
import Database from './config/database';
import ErrorHandler from './middlewares/error.middleware';
import Logger from './config/logger';
import { Server as SocketIOServer } from 'socket.io';
import morgan from 'morgan';

class App {
  public app: Application;
  public server: http.Server;
  public io: SocketIOServer;
  public host: string | number;
  public port: string | number;
  public api_version: string | number;
  public env: boolean;
  private db = new Database();
  private logStream = Logger.logStream;
  private logger = Logger.logger;
  public errorHandler = new ErrorHandler();

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app); // Create an HTTP server
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.host = process.env.APP_HOST;
    this.port = process.env.APP_PORT;
    this.api_version = process.env.API_VERSION;

    this.initializeMiddleWares();
    this.initializeRoutes();
    this.initializeDatabase();
    this.initializeErrorHandlers();
    this.initializeSockets();
    this.startApp();
  }

  public initializeSockets(): void {
    console.log('Server is starting...');
    this.io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
      console.log('Socket ID:', socket.id);
      // Listen for joining rooms
      socket.on('join-room', (roomId) => {
        console.log('Room ID:', roomId);
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      // Handle sending messages
      socket.on('send-message', (messageData) => {
        const { senderId, receiverId, message, groupId } = messageData;

        // Emit message to the specific room (group chat) or user (DM)
        if (groupId) {
          console.log('Message:', messageData);
          socket.to(groupId).emit('receive-message', message); // Broadcast to the group
        } else {
          this.io.to(receiverId).emit('receive-message', messageData); // Send to specific user for DM
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });
  }

  public initializeMiddleWares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan('combined', { stream: this.logStream }));
    this.app.use(passport.initialize());
    // this.app.use(passport.session());

    // for google authentication
    // this.app.use(
    //   session({
    //     secret: 'your_secret_key',
    //     resave: false,
    //     saveUninitialized: false
    //   })
    // );
  }

  public initializeDatabase(): void {
    this.db.initializeDatabase();
  }

  public initializeRoutes(): void {
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: '/swagger.json'
        }
      })
    );
    this.app.use(`/api/${this.api_version}`, routes());
  }

  public initializeErrorHandlers(): void {
    this.app.use(this.errorHandler.appErrorHandler);
    this.app.use(this.errorHandler.genericErrorHandler);
    this.app.use(this.errorHandler.notFound);
  }

  // Start the server with Socket.IO attached
  public startApp(): void {
    this.server.listen(this.port, () => {
      this.logger.info(
        `Server started at ${this.host}:${this.port}/api/${this.api_version}/`
      );
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

const app = new App();

export default app;
