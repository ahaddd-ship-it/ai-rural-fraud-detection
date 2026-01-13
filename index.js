const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fraud Detection API Running');
});

app.post('/analyze', (req, res) => {
  const {
    transactionAmount = 0,
    usualAmount = 0,
    deviceChanged = false,
    locationChanged = false,
    rapidTransactions = false,
  } = req.body || {};

  let fraudScore = 0;
  const explanation = [];

  if (transactionAmount > 3 * usualAmount) {
    fraudScore += 40;
    explanation.push('Amount is much higher than usual');
  }

  if (deviceChanged) {
    fraudScore += 30;
    explanation.push('You are using a new device');
  }

  if (locationChanged) {
    fraudScore += 20;
    explanation.push('You are in a new place');
  }

  if (rapidTransactions) {
    fraudScore += 25;
    explanation.push('Many quick transactions happened');
  }

  fraudScore = Math.min(fraudScore, 100);

  let riskLevel = 'Low';
  if (fraudScore >= 61) {
    riskLevel = 'High';
  } else if (fraudScore >= 31) {
    riskLevel = 'Medium';
  }

  res.json({
    fraudScore,
    riskLevel,
    explanation,
  });
});

app.listen(PORT, () => {
  console.log(`Fraud Detection API Running on port ${PORT}`);
});
