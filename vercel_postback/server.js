import express from 'express';
import postbackRouter from './api/postback.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', postbackRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 