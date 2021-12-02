const Producer = require('../models/producer')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

// Create new producer   =>   /api/v1/admin/producer/new
exports.newProducer = catchAsyncErrors(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'producers'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const producer = await Producer.create(req.body);

    res.status(201).json({
        success: true,
        producer
    })
})


// Get all producers   =>   /api/v1/producers?keyword=apple
exports.getProducers = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 4;
    const producersCount = await Producer.countDocuments();

    const apiFeatures = new APIFeatures(Producer.find(), req.query)
        .search()
        .filter()

    let producers = await apiFeatures.query;
    let filteredProducersCount = producers.length;

    apiFeatures.pagination(resPerPage)
    producers = await apiFeatures.query;


    res.status(200).json({
        success: true,
        producersCount,
        resPerPage,
        filteredProducersCount,
        producers
    })

})

// Get all producers (Admin)  =>   /api/v1/admin/producers
exports.getAdminProducers = catchAsyncErrors(async (req, res, next) => {

    const producers = await Producer.find();

    res.status(200).json({
        success: true,
        producers
    })

})

// Get single producer details   =>   /api/v1/producer/:id
exports.getSingleProducer = catchAsyncErrors(async (req, res, next) => {

    const producer = await Producer.findById(req.params.id);

    if (!producer) {
        return next(new ErrorHandler('Producer not found', 404));
    }


    res.status(200).json({
        success: true,
        producer
    })

})

// Update Producer   =>   /api/v1/admin/producer/:id
exports.updateProducer = catchAsyncErrors(async (req, res, next) => {

    let producer = await Producer.findById(req.params.id);

    if (!producer) {
        return next(new ErrorHandler('Producer not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the producer
        for (let i = 0; i < producer.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(producer.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'producers'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    producer = await Producer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        producer
    })

})

// Delete Producer   =>   /api/v1/admin/producer/:id
exports.deleteProducer = catchAsyncErrors(async (req, res, next) => {

    const producer = await Producer.findById(req.params.id);

    if (!producer) {
        return next(new ErrorHandler('Producer not found', 404));
    }

    // Deleting images associated with the producer
    for (let i = 0; i < producer.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(producer.images[i].public_id)
    }

    await producer.remove();

    res.status(200).json({
        success: true,
        message: 'Producer is deleted.'
    })

})
