const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../lib/supabaseClient');
const authMiddleware = require('../middleware/auth');
const { computeFraudScore } = require('../services/fraudScoring');

const router = express.Router();

/**
 * GET /dashboard/transactions
 * Returns last 20 transactions ordered by created_at DESC
 */
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return res.json({ transactions: data });
  } catch (err) {
    console.error('Transactions fetch error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Could not fetch transactions' });
  }
});

/**
 * GET /dashboard/users
 * Optional query param: userId
 */
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;

    let query = supabase.from('users').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({ users: data });
  } catch (err) {
    console.error('Users fetch error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Could not fetch users' });
  }
});

/**
 * GET /dashboard/stats
 * Returns counts by risk level (Supabase count API)
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { count: totalCount, error: totalError } = await supabase
      .from('transactions')
      .select('transaction_id', { count: 'exact', head: true });

    const { count: highCount, error: highError } = await supabase
      .from('transactions')
      .select('transaction_id', { count: 'exact', head: true })
      .eq('risk_level', 'High');

    const { count: mediumCount, error: mediumError } = await supabase
      .from('transactions')
      .select('transaction_id', { count: 'exact', head: true })
      .eq('risk_level', 'Medium');

    const { count: lowCount, error: lowError } = await supabase
      .from('transactions')
      .select('transaction_id', { count: 'exact', head: true })
      .eq('risk_level', 'Low');

    if (totalError || highError || mediumError || lowError) {
      throw totalError || highError || mediumError || lowError;
    }

    return res.json({
      totalTransactions: totalCount || 0,
      highRiskCount: highCount || 0,
      mediumRiskCount: mediumCount || 0,
      lowRiskCount: lowCount || 0,
    });
  } catch (err) {
    console.error('Stats fetch error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Could not fetch stats' });
  }
});

/**
 * POST /dashboard/simulate-transaction
 * Input: { userId, amount }
 * Runs existing fraud logic and stores transaction in Supabase
 */
router.post('/simulate-transaction', authMiddleware, async (req, res) => {
  try {
    const { userId, amount } = req.body || {};

    if (!userId || !amount) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'userId and amount required' });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, usual_amount')
      .eq('user_id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User not found' });
    }

    const analysis = computeFraudScore({
      transactionAmount: amount,
      usualAmount: user.usual_amount || 0,
      deviceChanged: false,
      locationChanged: false,
      rapidTransactions: false,
    });

    const transaction = {
      transaction_id: uuidv4(),
      user_id: userId,
      amount,
      risk_level: analysis.riskLevel,
      fraud_score: analysis.fraudScore,
      explanation: Array.isArray(analysis.explanation)
        ? analysis.explanation.join('; ')
        : analysis.explanation,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;

    return res.json({ transaction: data });
  } catch (err) {
    console.error('Simulation error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Simulation failed' });
  }
});

module.exports = router;
