const express=require('express');
const router=express.Router();

const mongoose = require('mongoose');
const barberModel = require('../models/barberSchema');
const customerModel = require('../models/customerSchema');

mongoose.Promise=global.Promise;


const reviewModel=require('../models/reviewSchema');


router.post('/:id', (req, res) => {
    const { ratings,  comments, author,} = req.body;

    if (ratings== null) {//comments can be blank
        res.json('You must select the rating');

    } else {
        customerModel.findById(author).then(customer=>{
            if(customer==null)
            {
                res.json('Error')
            }
            else{

                
                let newReview = new reviewModel(req.body);

                newReview.save((err) => {

                    if (err) {
                    res.json(err);
                    } 
                    else 
                    {
                        barberModel.updateOne({_id: req.params.id}, {$push: {reviews: newReview}})
                        .then(res.json(`Barber ${ req.params.id } got new comment`))
                        .catch(err => res.json(err))}
                    
        
                });
            }

        }).catch(err=>res.json(err));
        
    }

});

// Get all review 
//not sure about this route since review is connected to each barber.
router.get('/', (req, res) => {
    reviewModel.find().populate('author').exec()
        .then(reviews => res.json(reviews))
        .catch(err => res.json(err));
});

// Get review by id
router.get('/:id', (req, res) => {
    reviewModel.findOne({_id: req.params.id}).populate('author').exec()
        .then(review => res.json(review))
        .catch(err => res.json(err));
});

// Update schedule by id
router.put('/:id', (req, res) => {
    const { ratings, comments, valid } = req.body;

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
