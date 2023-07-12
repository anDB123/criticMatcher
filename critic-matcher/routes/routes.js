const express = require('express');

const router = express.Router()

module.exports = router;

const mongoose = require('mongoose');

const Model = require('../models/model');



//Post Method
router.post('/post', (req, res) => {

    const { userName, reviews } = req.body;

    const data = new Model({
        userName: userName,
        reviews: reviews
    })

    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/getOne/', async (req, res) => {
    try {
        const data = await Model.findOne({ userName: req.query.userName });;
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


//add a method to update a review
router.patch('/update/', async (req, res) => {
    try {
        const data = await Model.findOneAndUpdate({ userName: req.body.userName }, { "$push": { reviews: req.body.reviews } });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}
)

//add a method to delete a review
router.delete('/delete/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        const dataToSave = await data.delete();
        res.json(dataToSave)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}
)

