const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job')

const getAllJobs = async (req, res) => {
    //The code below is for getting all job request create by the user and sorting it by the date it was created
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs?.length })
}

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOne({
        _id: jobId, createdBy: userId
    })
    if (!job) {
        return res.status(404).json({
            status: false,
            message: `No job with id ${jobId}`
        })
    }

    res.status(StatusCodes.OK).json({
        status: true,
        data: job,
    })
    // res.send('get a single job')
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    return res.status(StatusCodes.CREATED).json(job)
    // console.log(req.user)
}

const updateJob = async (req, res) => {
    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req

    if (company === '' || position === '') {
        return res.status(400).json({
            status: false,
            meassage: 'Company or Postion fileds cannot be empty'
        })
    }

    const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })
    if (!job) {
        return res.status(404).json({
            status: false,
            message: `No job with id ${jobId}`
        })
    }
    res.status(StatusCodes.OK).json({
        status: true,
        message:'Update Successfully',
        data: job,
    })
}

const deleteJob = async (req, res) => {
    const {user: { userId }, params: { id: jobId } } = req
    const job = await Job.findByIdAndRemove({_id:jobId, createdBy:userId})
    if (!job) {
        return res.status(404).json({
            status: false,
            message: `No job with id ${jobId}`
        })
    }
    res.status(StatusCodes.OK).json({
        status: true,
        message:'Deleted Successfully'
    })
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}