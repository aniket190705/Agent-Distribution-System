const express = require('express');
const { addAgent, getAgents } = require('../controllers/agentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, addAgent);
router.get('/', auth, getAgents);

module.exports = router;
