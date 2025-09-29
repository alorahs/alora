import express from 'express';
import Service from '../models/service.js';
import { isAdmin } from '../middleware/authorization.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();
// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new service
router.post('/', verifyAccessToken, isAdmin, async (req, res) => {
  const { title, description, icon, color } = req.body;
  if (!title || !description || !icon || !color) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newService = new Service({ title, description, icon, color });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/bulk', verifyAccessToken, isAdmin, async (req, res) => {
  const services = req.body;

  if (!Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ message: 'Invalid service data' });
  }

  try {
    const createdServices = await Service.insertMany(services);
    res.status(201).json(createdServices);
  } catch (error) {
    console.error('Error creating services in bulk:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a service by ID
router.delete('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//put update service by ID
router.put('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, icon, color } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { title, description, icon, color },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;