import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import usersRouter from './routes/users.js';

const app = express();
const port = Number(process.env.PORT) || 3001;
const clientDistPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../client/dist'
);

app.get(['/health', '/api/health'], (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));
  app.get(/.*/, (_request, response, next) => {
    response.sendFile(path.join(clientDistPath, 'index.html'), error => {
      if (error) next(error);
    });
  });
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});