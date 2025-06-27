const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ticketsController = require('../controllers/ticketsController');
const hubspotController = require('../controllers/hubspotController');
const authMiddleware = require('../middleware/authMiddleware');
const webhookController = require('../controllers/webhookController');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/freshdesk', authMiddleware, authController.updateFreshdesk);
router.post('/hubspot', authMiddleware, authController.updateHubspot);

// Freshdesk ticket/contact routes
router.get('/freshdesk/tickets', authMiddleware, ticketsController.getFreshdeskTickets);
router.get('/freshdesk/tickets/:id', authMiddleware, ticketsController.getFreshdeskTicketDetails);
router.get('/freshdesk/tickets/:id/conversations', authMiddleware, ticketsController.getFreshdeskTicketConversations);
router.get('/freshdesk/contacts/:id', authMiddleware, ticketsController.getFreshdeskContactDetails);

// HubSpot contact route
router.get('/hubspot/contact', authMiddleware, hubspotController.getHubspotContactByEmail);

router.post('/webhook/freshdesk', webhookController.receiveFreshdeskWebhook);
router.get('/webhook/logs', authMiddleware, webhookController.getWebhookLogs);
router.get('/user', authMiddleware, authController.getUser);

module.exports = router; 