'use strict'

import express from 'express';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const { PORT = '3000' } = process.env

const app = express()

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.use((req, res, next) => {
  res.send('Welcome To The New World')
})

app.listen(PORT)