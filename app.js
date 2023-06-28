'use strict'

import express from 'express';

const { PORT = '3000' } = process.env
const app = express()

app.use((req, res, next) => {
  res.send('Welcome To The New World')
})

app.listen(PORT)