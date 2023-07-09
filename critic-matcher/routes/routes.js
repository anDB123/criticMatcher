const express = require('express');

const router = express.Router()

module.exports = router;

const mongoose = require('mongoose');

const Model = require('../models/model');



//Post Method
router.post('/post', (req, res) => {

    const { movieName, score } = req.body;

    const data = new Model({
        movieName: movieName,
        score: score
    })



    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/getall', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})