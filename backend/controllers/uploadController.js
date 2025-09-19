const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const Distribution = require('../models/Distribution');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for CSV and Excel files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, XLS, and XLSX files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Validate required columns
        if (data.FirstName && data.Phone) {
          results.push({
            firstName: data.FirstName.trim(),
            phone: data.Phone.toString().trim(),
            notes: data.Notes ? data.Notes.trim() : ''
          });
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return data.map(row => ({
      firstName: row.FirstName ? row.FirstName.toString().trim() : '',
      phone: row.Phone ? row.Phone.toString().trim() : '',
      notes: row.Notes ? row.Notes.toString().trim() : ''
    })).filter(row => row.firstName && row.phone);
  } catch (error) {
    throw new Error('Error parsing Excel file');
  }
};

// Distribute leads among agents
const distributeLeads = (leads, agents) => {
  const distributions = [];
  const leadsPerAgent = Math.floor(leads.length / agents.length);
  const remainder = leads.length % agents.length;

  let currentIndex = 0;

  agents.forEach((agent, index) => {
    const extraLead = index < remainder ? 1 : 0;
    const leadsCount = leadsPerAgent + extraLead;

    const agentLeads = leads.slice(currentIndex, currentIndex + leadsCount);

    distributions.push({
      agentId: agent._id,
      leads: agentLeads
    });

    currentIndex += leadsCount;
  });

  return distributions;
};

// @desc    Upload and distribute CSV/Excel file
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res) => {
  try {
    // Get all agents
    const agents = await Agent.find().limit(5);

    if (agents.length < 5) {
      return res.status(400).json({
        message: `You need exactly 5 agents to distribute leads. Currently have ${agents.length} agents.`
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let leads = [];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Parse file based on extension
    if (fileExtension === '.csv') {
      leads = await parseCSV(file.path);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      leads = await parseExcel(file.path);
    }

    // Validate parsed data
    if (leads.length === 0) {
      fs.unlinkSync(file.path); // Clean up uploaded file
      return res.status(400).json({
        message: 'No valid data found. Please ensure your file has FirstName and Phone columns.'
      });
    }

    // Distribute leads among agents
    const distributions = distributeLeads(leads, agents);

    // Clear existing distributions
    await Distribution.deleteMany({});

    // Save new distributions to database
    const savedDistributions = await Distribution.insertMany(distributions);

    // Clean up uploaded file
    fs.unlinkSync(file.path);

    // Prepare response data
    const responseData = await Distribution.find()
      .populate('agentId', 'name email')
      .exec();

    res.json({
      message: 'File uploaded and leads distributed successfully',
      totalLeads: leads.length,
      distributions: responseData.map(dist => ({
        agent: dist.agentId,
        leadsCount: dist.leads.length,
        leads: dist.leads
      }))
    });
  } catch (error) {
    console.error('Upload error:', error);

    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: 'Server error during file upload' });
  }
};

// @desc    Get current distributions
// @route   GET /api/upload/distributions
// @access  Private
const getDistributions = async (req, res) => {
  try {
    const distributions = await Distribution.find()
      .populate('agentId', 'name email mobile')
      .exec();

    res.json({
      distributions: distributions.map(dist => ({
        agent: dist.agentId,
        leadsCount: dist.leads.length,
        leads: dist.leads,
        distributionDate: dist.distributionDate
      }))
    });
  } catch (error) {
    console.error('Get distributions error:', error);
    res.status(500).json({ message: 'Server error fetching distributions' });
  }
};

module.exports = {
  upload: upload.single('file'),
  uploadFile,
  getDistributions
};
