const User = require('../models/User');
const axios = require('axios');

exports.getFreshdeskTickets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.freshdeskApiKey || !user.freshdeskDomain) {
      return res.status(400).json({ message: 'Freshdesk credentials not set' });
    }
    const url = `https://${user.freshdeskDomain}.freshdesk.com/api/v2/tickets`;
    const response = await axios.get(url, {
      auth: {
        username: user.freshdeskApiKey,
        password: 'password'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets check domain and api key', error: err.message });
  }
};

exports.getFreshdeskTicketDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.freshdeskApiKey || !user.freshdeskDomain) {
      return res.status(400).json({ message: 'Freshdesk credentials not set' });
    }
    const ticketId = req.params.id;
    const url = `https://${user.freshdeskDomain}.freshdesk.com/api/v2/tickets/${ticketId}`;
    const response = await axios.get(url, {
      auth: {
        username: user.freshdeskApiKey,
        password: 'password'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ticket details check domain and api key', error: err.message });
  }
};

exports.getFreshdeskTicketConversations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.freshdeskApiKey || !user.freshdeskDomain) {
      return res.status(400).json({ message: 'Freshdesk credentials not set' });
    }
    const ticketId = req.params.id;
    const url = `https://${user.freshdeskDomain}.freshdesk.com/api/v2/tickets/${ticketId}/conversations`;
    const response = await axios.get(url, {
      auth: {
        username: user.freshdeskApiKey,
        password: 'password'
      }
    });
    // Only return public replies/notes
    const publicConversations = response.data.filter(conv => conv.private === false);
    res.json(publicConversations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ticket conversations', error: err.message });
  }
};

exports.getFreshdeskContactDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.freshdeskApiKey || !user.freshdeskDomain) {
      return res.status(400).json({ message: 'Freshdesk credentials not set' });
    }
    const contactId = req.params.id;
    const url = `https://${user.freshdeskDomain}.freshdesk.com/api/v2/contacts/${contactId}`;
    const authHeader = 'Basic ' + Buffer.from(`${user.freshdeskApiKey}:X`).toString('base64');
    const response = await axios.get(url, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch contact details', error: err.message });
  }
}; 