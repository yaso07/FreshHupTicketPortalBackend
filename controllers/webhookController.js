

const WebhookLog = require('../models/WebhookLog');

exports.receiveFreshdeskWebhook = async (req, res) => {
  try {
    console.log(req.body)
    const eventType = req.body.trigger || req.body.type || 'unknown';
    const payload = req.body;
    await WebhookLog.create({ eventType, payload });
    res.status(200).json({ message: 'Webhook received' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to log webhook', error: err.message });
  }
};


exports.getWebhookLogs = async (req, res) => {
  try {
    const logs = await WebhookLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
}; 