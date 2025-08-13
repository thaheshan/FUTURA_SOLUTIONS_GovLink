import express = require('express');
import cors = require('cors');
import helmet = require('helmet');
import * as morgan from 'morgan';
import compression = require('compression');


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());

//app.use('/api/v1/auth', authRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({ error: err.message });
});

export default app;
