const express = require('express');
const { getEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getEmployees);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
