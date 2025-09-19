const Agent = require('../models/Agent');

// @desc    Add new agent
// @route   POST /api/agents
// @access  Private
const addAgent = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Validation
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, email, mobile, password'
            });
        }

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({ message: 'Agent with this email already exists' });
        }

        // Create new agent
        const agent = new Agent({
            name,
            email,
            mobile,
            password
        });

        await agent.save();

        // Return agent without password
        const { password: _, ...agentData } = agent.toObject();

        res.status(201).json({
            message: 'Agent created successfully',
            agent: agentData
        });
    } catch (error) {
        console.error('Add agent error:', error);
        res.status(500).json({ message: 'Server error creating agent' });
    }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
const getAgents = async (req, res) => {
    try {
        const agents = await Agent.find().select('-password');
        res.json({ agents });
    } catch (error) {
        console.error('Get agents error:', error);
        res.status(500).json({ message: 'Server error fetching agents' });
    }
};

module.exports = {
    addAgent,
    getAgents
};
