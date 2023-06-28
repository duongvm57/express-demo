'use strict'

import express from 'express';

const { PORT = '3000' } = process.env
const app = express()

app.use((req, res, next) => {
  res.send('Hello World Haha')
})

app.listen(PORT)