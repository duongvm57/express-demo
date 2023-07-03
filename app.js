'use strict'

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import 'dotenv/config';
import cors from "cors";

const { PORT = '3000' } = process.env;
const __filename = path.resolve();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const uri = process.env.MONGO_URI;
mongoose.connect(uri).catch(error => console.log(error));

const server = http.createServer(app);
const io = new Server(server);

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

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