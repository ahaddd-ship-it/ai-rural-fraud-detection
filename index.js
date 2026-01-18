const express = require('express');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const { computeFraudScore } = require('./services/fraudScoring');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fraud Detection API Running');
});

// Existing /analyze endpoint preserved, now uses helper
app.post('/analyze', (req, res) => {
  const {
    transactionAmount = 0,
    usualAmount = 0,
    deviceChanged = false,
    locationChanged = false,
    rapidTransactions = false,
  } = req.body || {};

  const result = computeFraudScore({
    transactionAmount,
    usualAmount,
    deviceChanged,
    locationChanged,
    rapidTransactions,
  });

  res.json({
    fraudScore: result.fraudScore,
    riskLevel: result.riskLevel,
    explanation: result.explanation,
  });
});

// New routes
app.use('/admin', adminRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Fraud Detection API Running on port ${PORT}`);
});
