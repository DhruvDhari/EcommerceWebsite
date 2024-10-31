const User = require('../models/User');

exports.getEmployees = async (req, res) => {
  try {
   
    const employees = await User.find().select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).send('Server error');
  }
};


exports.updateEmployee = async (req, res) => {

  const { username, email } = req.body;
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    
    employee.username = username || employee.username;
    employee.email = email || employee.email;
    await employee.save();
  
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.id);


    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({ message: 'Employee deleted successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
