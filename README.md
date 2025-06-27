# Customer Support Ticket View Portal Backend

This is the backend for the Customer Support Ticket View Portal. It provides authentication, Freshdesk and HubSpot integration, and API endpoints for viewing support tickets and contacts.

## Features
- User registration and login with JWT authentication
- Freshdesk API integration (tickets, contacts)
- HubSpot API integration (contact lookup)
- Webhook support for Freshdesk
- User credential verification and status

## Project Structure
```
controllers/         # Route handlers for business logic
middleware/          # Authentication middleware
models/              # Mongoose models
routes/              # Express route definitions
server.js            # App entry point
```

## Setup Instructions
1. **Clone the repository:**

2. **Install dependencies:**

   npm install

3. **Create a `.env` file:**

   PORT=5000
   MONGO_URI=use your mongodb URI
   JWT_SECRET=your_jwt_secret
 
4. **Start the server:**

   npm run dev
   

## Environment Variables
- `PORT` - Port to run the server (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing

## API Endpoints

## setup freshdesk webhook for tickets:

To receive real-time updates when a ticket is created or updated in Freshdesk, a webhook is manually configured under Admin > Workflows > Automations ->Ticket Updates, Ticket Creation. This webhook sends ticket data to the app’s backend at /api/webhook/freshdesk and stored in the db . For full setup instructions, refer this Freshdesk's official webhook documentation.

link : [https://support.freshdesk.com/support/solutions/articles/132589-using-webhooks-in-automation-rules]


### Auth
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and receive JWT
- `GET /api/user` - Get current user info (auth required)
- `POST /api/freshdesk` - Update Freshdesk credentials (auth required)
- `POST /api/hubspot` - Update HubSpot token (auth required)

### Freshdesk
- `GET /api/freshdesk/tickets` - List tickets
- `GET /api/freshdesk/tickets/:id` - Ticket details
- `GET /api/freshdesk/tickets/:id/conversations` - Ticket conversations
- `GET /api/freshdesk/contacts/:id` - Contact details

### HubSpot
- `GET /api/hubspot/contact?email=".."` - Get contact by email

### Webhooks
- `POST /api/webhook/freshdesk` - Receive Freshdesk webhook
- `GET /api/webhook/logs` - List webhook logs (auth required)

 