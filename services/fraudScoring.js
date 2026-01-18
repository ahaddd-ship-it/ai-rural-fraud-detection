/**
 * Fraud scoring logic extracted from POST /analyze.
 * Behavior remains identical.
 */
function computeFraudScore({
  transactionAmount,
  usualAmount,
  deviceChanged,
  locationChanged,
  rapidTransactions,
}) {
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

  return { fraudScore, riskLevel, explanation };
}

module.exports = { computeFraudScore };
