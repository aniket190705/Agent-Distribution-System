# Agent Distribution System

A MERN stack application for managing agents and distributing leads from CSV/Excel files equally among 5 agents.

## Features

- **Admin Authentication**: JWT-based login and signup system
- **Agent Management**: Add and view agents with complete profile information
- **File Upload**: Support for CSV, XLS, and XLSX file formats
- **Smart Distribution**: Automatically distribute leads equally among 5 agents
- **Distribution Tracking**: View detailed lead assignments for each agent
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, JWT, Multer, CSV Parser, XLSX  
**Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios

## Installation

### Backend Setup
```
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agent-distribution
JWT_SECRET=your_super_secret_jwt_key_here
```

Start backend:
```
npm run dev
```

### Frontend Setup
```
cd frontend
npm install
```


Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

Start frontend:
```
npm run dev
```

## Usage

1. **Sign Up/Login**: Create admin account or login with existing credentials
2. **Add Agents**: Create exactly 5 agents with name, email, mobile, password
3. **Upload File**: Upload CSV/Excel with required columns
4. **View Distribution**: Check lead assignments for each agent

## File Format

Required columns: **FirstName**, **Phone**, **Notes** (optional)

FirstName,Phone,Notes
John,+91-9876543210,Interested in premium package
Sarah,+1-555-0123,Called twice - very interested
Michael,+44-7700-900123,Potential high-value client


## Distribution Logic

- Leads distributed equally among 5 agents
- Remainder distributed sequentially
- Example: 27 leads → 5, 5, 5, 6, 6 leads per agent

## API Endpoints

- `POST /api/auth/signup` - Create admin account
- `POST /api/auth/login` - Admin login
- `POST /api/agents` - Add new agent
- `GET /api/agents` - Get all agents
- `POST /api/upload` - Upload and distribute leads
- `GET /api/upload/distributions` - Get current distributions

## Project Structure

agent-distribution-system/
```
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── utils/
│ │ └── App.jsx
│ └── package.json
└── README.md
```

## Development

Backend development:
```
cd backend && npm run dev
```


Frontend development:
```
cd frontend && npm run dev
```
