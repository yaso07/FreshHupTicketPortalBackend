const User = require('../models/User');
const axios = require('axios');

exports.getHubspotContactByEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.hubspotToken) {
      return res.status(400).json({ message: 'HubSpot token not set' });
    }
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const url = `https://api.hubapi.com/crm/v3/objects/contacts/search`;
    const response = await axios.post(
      url,
      {
        filterGroups: [
          {
            filters: [
              { propertyName: 'email', operator: 'EQ', value: email }
            ]
          }
        ],
        properties: ['firstname', 'lastname', 'email', 'lifecyclestage', 'phone', 'company']
      },
      {
        headers: {
          Authorization: `Bearer ${user.hubspotToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data.total === 0) {
      return res.status(404).json({ message: 'No HubSpot contact found for this email' });
    }
    const contact = response.data.results[0];
    res.json({
      name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
      email: contact.properties.email,
      lifecycleStage: contact.properties.lifecyclestage,
      phone: contact.properties.phone,
      company: contact.properties.company
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch HubSpot contact', error: err.message });
  }
}; 