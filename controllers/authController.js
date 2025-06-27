const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

exports.register = async (req, res) => {
  const { email, password ,name} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword,name:name });
    await user.save();
   
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
   
    const userDetails = {
      id: user._id,
      email: user.email,
      name:user.name,
      freshdeskApiKey: user.freshdeskApiKey || null,
      freshdeskDomain: user.freshdeskDomain || null,
      hubspotToken: user.hubspotToken || null
    };
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: userDetails
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
    const needsFreshdesk = !user.freshdeskApiKey;
    const needsHubspot = !user.hubspotToken;
    const userDetails = {
      id: user._id,
      email: user.email,
      name:user.name,
      freshdeskApiKey: user.freshdeskApiKey || null,
      freshdeskDomain: user.freshdeskDomain || null,
      hubspotToken: user.hubspotToken || null
    };
    res.json({
      token,
      user:userDetails,
      message: (needsFreshdesk || needsHubspot)
        ? 'Please connect your Freshdesk and HubSpot accounts.'
        : 'Login successful.'
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

 

exports.updateFreshdesk = async (req, res) => {
  const { apiKey:freshdeskApiKey, domain:freshdeskDomain } = req.body;
  let freshdeskStatus = 'notverified';
  let message = 'Freshdesk credentials are not valid.';
  console.log("yes",freshdeskApiKey,freshdeskDomain)
  if (freshdeskApiKey && freshdeskDomain) {
   
    try {
      console.log("yes")
      const url = `https://${freshdeskDomain}.freshdesk.com/api/v2/tickets`;
      const authHeader = 'Basic ' + Buffer.from(`${freshdeskApiKey}:X`).toString('base64');

     const response= await axios.get(url, {
        auth: {
          username: freshdeskApiKey,
          password: 'freshdesk'
        },
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.status,"88")
      freshdeskStatus = 'verified';
      message = 'Freshdesk credentials verified and updated.';
    } catch (err) {
  console.log(err)
      freshdeskStatus = 'notverified';
      message = 'Freshdesk credentials are not valid.';
      return res.status(400).json({message})
    }
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { freshdeskApiKey, freshdeskDomain, freshdeskStatus },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateHubspot = async (req, res) => {
  const { token:hubspotToken } = req.body;
  let hubspotStatus = 'notverified';
  let message = 'HubSpot token is not valid.';
  if (hubspotToken) {
    try {
      const url = `https://api.hubapi.com/integrations/v1/me`;
      await axios.get(url, {
        headers: {
          Authorization: `Bearer ${hubspotToken}`
        }
      });
      hubspotStatus = 'verified';
      message = 'HubSpot token verified and updated.';
    } catch (err) {
      hubspotStatus = 'notverified';
      message = 'HubSpot token is not valid.';
      return res.status(400).json({message})
    }
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { hubspotToken, hubspotStatus },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const needsFreshdesk = !user.freshdeskApiKey;
    const needsHubspot = !user.hubspotToken;
    const userDetails = {
      id: user._id,
      email: user.email,
      name: user.name,
      freshdeskApiKey: user.freshdeskApiKey || null,
      freshdeskDomain: user.freshdeskDomain || null,
      hubspotToken: user.hubspotToken || null
    };
    res.json({ user: userDetails,message:(needsFreshdesk || needsHubspot)
      ? 'Please connect your Freshdesk and HubSpot accounts.':"success" });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};