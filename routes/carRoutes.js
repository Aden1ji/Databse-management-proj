const express = require('express');
const router = express.Router();
const Cars = require('../models/Cars');

// Create a car
router.post('/', async (req, res) => {
    try {
        const car = await Cars.create(req.body);
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all cars
router.get('/', async (req, res) => {
    const cars = await Cars.findAll();
    res.json(cars);
});

// Get one car
router.get('/:id', async (req, res) => {
    const car = await Cars.findByPk(req.params.id);
    if (car) res.json(car);
    else res.status(404).json({ error: "Car not found" });
});

// Update car
router.put('/:id', async (req, res) => {
    await Cars.update(req.body, { where: { car_id: req.params.id } });
    res.json({ message: "Car updated" });
});

// Delete car
router.delete('/:id', async (req, res) => {
    await Cars.destroy({ where: { car_id: req.params.id } });
    res.json({ message: "Car deleted" });
});

module.exports = router;
