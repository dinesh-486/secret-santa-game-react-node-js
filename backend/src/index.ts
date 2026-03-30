import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import assignmentRoutes from './routes/assignments';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/assignments', assignmentRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Secret Santa Game API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      generate: 'POST /api/assignments/generate',
      download: 'GET /api/assignments/download/:filename',
    },
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);

  if (err.message && err.message.includes('Only CSV files are allowed')) {
    return res.status(400).json({
      error: 'Only CSV files are allowed',
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`Secret Santa API running on http://localhost:${PORT}`);
});

export default app;
