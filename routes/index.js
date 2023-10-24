const express = require('express');

// Import our modular routers for /tips and /feedback
const roleRouter = require('./role');
const departmentRouter = require('./department');
const employeeRouter = require('./employee');

const app = express();

app.use('/role', roleRouter);
app.use('/department', departmentRouter);
app.use('/employee', employeeRouter);

module.exports = app;