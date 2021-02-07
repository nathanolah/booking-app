const express=require('express');
const router=express.Router();

const mongoose = require('mongoose');

mongoose.Promise=global.Promise;


const reviewModel=require('../models/reviewSchema');


router.post('/', (req, res) => {
    const { ratings,  comments } = req.body;

    if (ratings== null) {//comments can be blank
        res.json('You must select the rating');

    } else {
        let newReview = new reviewModel(req.body);
        newReview.save((err) => {
            if (err) {
                res.json(err);
            } else {
                res.json(`New review: ${ newReview._id } was added to collection`);
            }
        });
    }

});

// Get all review 
//not sure about this route since review is connected to each barber.
router.get('/', (req, res) => {
    reviewModel.find().exec()
        .then(reviews => res.json(reviews))
        .catch(err => res.json(err));
});

// Get review by id
router.get('/:id', (req, res) => {
    reviewModel.findOne({_id: req.params.id}).exec()
        .then(review => res.json(review))
        .catch(err => res.json(err));
});

// Update schedule by id
router.put('/:id', (req, res) => {
    const { ratings, comments } = req.body;

    if (ratings == null) {
        res.json('You must select the rating');

    } else {
        reviewModel.updateOne({_id: req.params.id}, {$set: req.body})
            .then(res.json(`Review ${ req.params.id } successfully updated`))
            .catch(err => res.json(err));
    }

});

// Delete schedule by id
router.delete('/:id', (req, res) => {
    reviewModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Review ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});

module.exports = router;

