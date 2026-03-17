const express = require('express');
const { seedDatabase } = require('../controllers/dbController');

const router = express.Router();

router.post('/seed', seedDatabase);

module.exports = router;