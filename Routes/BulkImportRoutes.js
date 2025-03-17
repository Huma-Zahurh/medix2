const express = require('express');
const { requireSingIn, isAdmin } = require('../Middlewares/AuthMiddlewares');
const { excelUpload } = require('../Middlewares/Multer'); 
const { importFromExcel } = require('../Controllers/BulkImportController');


//Route object
const route = express.Router();

route.post('/import-excel', requireSingIn, isAdmin, excelUpload.single('excelFile'), importFromExcel);

module.exports = route;