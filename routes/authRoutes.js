const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ticketsController = require('../controllers/ticketsController');
const hubspotController = require('../controllers/hubspotController');
const authMiddleware = require('../middleware/authMiddleware');
const webhookController = require('../controllers/webhookController');

//auth 
router.post('/register', authController.register);
router.post('/login', authController.login);

// api , token updation for freshdesk and hupspot
router.post('/freshdesk', authMiddleware, authController.updateFreshdesk);
router.post('/hubspot', authMiddleware, authController.updateHubspot);

// Freshdesk ticket/contact routes
router.get('/freshdesk/tickets', authMiddleware, ticketsController.getFreshdeskTickets);
router.get('/freshdesk/tickets/:id', authMiddleware, ticketsController.getFreshdeskTicketDetails);
router.get('/freshdesk/tickets/:id/conversations', authMiddleware, ticketsController.getFreshdeskTicketConversations);
router.get('/freshdesk/contacts/:id', authMiddleware, ticketsController.getFreshdeskContactDetails);

// HubSpot contact route
router.get('/hubspot/contact', authMiddleware, hubspotController.getHubspotContactByEmail);

//webhook
router.post('/webhook/freshdesk', webhookController.receiveFreshdeskWebhook);
router.get('/webhook/logs', authMiddleware, webhookController.getWebhookLogs);

//user details
router.get('/user', authMiddleware, authController.getUser);

module.exports = router; 