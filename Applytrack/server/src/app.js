import express from 'express';

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

export default app;
