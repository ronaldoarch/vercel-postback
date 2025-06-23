import express from 'express';
import bodyParser from 'body-parser';
import postbackRouter from './api/postback.js';

const app = express();
app.use(bodyParser.json());
app.use('/api', postbackRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
}); 