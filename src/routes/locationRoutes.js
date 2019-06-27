const express = require('express');
const locationRouter = express.Router();
const locationController = require('../controllers/locationController');

locationRouter.get('/', locationController.getLocations);
locationRouter.post('/', locationController.createLocation);
locationRouter.get('/:id', locationController.getLocation);
locationRouter.put('/:id', locationController.updateLocation);
locationRouter.delete('/:id', locationController.deleteLocation);

module.exports = locationRouter;
