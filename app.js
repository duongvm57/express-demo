'use strict'

import express from 'express';
import mongoose from 'mongoose';
import * as http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import 'dotenv/config';
import cors from "cors";
import Message from './models/message.js';
import apiRouter from './routes/index.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const { PORT = '3000' } = process.env;
const __filename = path.resolve();
const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version: '1.0',
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['routes/*.route.js'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));
app.use('/api', apiRouter);

const uri = process.env.MONGO_URI;
mongoose.connect(uri).catch(error => console.log(error));

const server = http.createServer(app);
const io = new Server(server);

app.get('/', function (req, res) {
  res.sendFile(__filename + '/index.html');
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({});
    res.send(messages)
  } catch (error) {
    console.log(error);
    res.status(500).send('Error')
  }
})

app.post('/messages', async (req, res) => {
  try {
    let message = new Message(req.body);
    await message.save();
    io.emit('message', req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

io.on('connection', () => {
  console.log('a user is connected')
});

server.listen(PORT);