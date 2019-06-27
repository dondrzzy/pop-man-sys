const Location = require('../models/location');

const updateParentLocationStats = async (parentId, maleValue, femaleValue, flag) => {
  // find parent location and add new residents
  const parentLocation = await Location.findById(parentId);
  if (flag === 'add') {
    parentLocation.male = '' + (parseInt(parentLocation.male) + parseInt(maleValue));
    parentLocation.female = '' + (parseInt(parentLocation.female) + parseInt(femaleValue));
    await parentLocation.save();
  } else {
    parentLocation.male = '' + (parseInt(parentLocation.male) - parseInt(maleValue));
    parentLocation.female = '' + (parseInt(parentLocation.female) - parseInt(femaleValue));
    await parentLocation.save();
  }
  
}

module.exports = {
  getLocations: (req, res) => {
    Location.find((err, locations) => {
      if (err) {
        return res.status(400).json({error: err});
      }
      return res.status(200).json({locations});
    });
  },
  getLocation: (req, res) => {
    Location.findOne({_id: req.params.id}, (err, location) => {
      if (err) {
        return res.status(400).json({error: err});
      }
      if (!location) {
        return res.status(404).json({error: 'Location not found.'});
      }
      return res.status(200).json({location});
    });
  },
  updateLocation: async (req, res) => {
    let errors = {};
    if (!req.body.name) {
      errors.name = 'Please provide a location name.';
    }
    if (!req.body.female) {
      errors.female = 'Please provide the number of female residents.';
    }
    if (!req.body.male) {
      errors.male = 'Please provide the number of male residents.';
    }
    if (req.body.parentId) {
      try {
        const parentLocation = await Location.findOne({_id: req.body.parentId});
        if (!parentLocation) {
          errors.parent = 'Parent location not found.';
        }
      } catch (error) {
        return res.status(400).json({error});
      }
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({errors});
    };

    try {
      const locationToUpdate = await Location.findOne({_id: req.params.id});
      if (!locationToUpdate) {
        return res.status(404).json({error: 'Location does not exist'});
      }

      locationToUpdate.name = req.body.name;
      locationToUpdate.female = req.body.female;
      locationToUpdate.male = req.body.male;
      locationToUpdate.parentId = req.body.parentId;

      const resp = await locationToUpdate.save();
      return res.status(200).json({testingLocation: 'okay!'});
    } catch (error) {
      return res.status(400).json({error});
    }
    
  },
  createLocation: async (req, res) => {
    let errors = {};
    if (!req.body.name) {
      errors.name = 'Please provide a location name.';
    }
    if (!req.body.female) {
      errors.female = 'Please provide the number of female residents.';
    }
    if (!req.body.male) {
      errors.male = 'Please provide the number of male residents.';
    }
    if (req.body.parentId) {
      try {
        const parentLocation = await Location.findOne({_id: req.body.parentId});
        if (!parentLocation) {
          errors.parent = 'Parent location not found.';
        }
      } catch (error) {
        return res.status(400).json({error});
      }
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({errors});
    };
    
    try {
      const existingLocation = await Location.findOne({name: req.body.name});
      if (existingLocation) {
        return res.status(422).json({error: 'Location already exists.'});
      }
    } catch (error) {
      return res.status(400).json({error});
    }

    const newLocation = new Location({
      name: req.body.name,
      female: req.body.female,
      male: req.body.male,
      parentId: req.body.parentId,
    });

    try {
      await newLocation.save()
      // update parent location after saving location
      if (req.body.parentId) {
        updateParentLocationStats(newLocation.parentId, newLocation.male, newLocation.female, 'add');
      }
      return res.status(201).json({message: 'Location created successfully'});
    } catch (error) {
      return res.status(400).json({error});
    }
  },
  deleteLocation:  (req, res) => {
    Location.findOne({_id: req.params.id}, (err, location) => {
      if (err) {
        return res.status(400).json({error: err});
      }
      if (!location) {
        return res.status(404).json({error: 'Location to delete not found'});
      }
      // update parent location after deleting location
      if (location.parentId) {
        updateParentLocationStats(location.parentId, location.male, location.female, '');
      }
      location.remove((err, location) => {
        return res.status(200).json({message: 'Location successfully deleted'});
      });
    });
  }
}
