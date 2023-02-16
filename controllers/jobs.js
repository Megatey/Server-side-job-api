const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job')

const getAllJobs = async (req, res) => {
    //The code below is for getting all job request create by the user and sorting it by the date it was created
    try {
        const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
        if(!jobs) {
            res.status(404).json({status: false, msg: "No Job Found"})
        }
        res.status(StatusCodes.OK).json({status: true, jobs, count: jobs?.length })
    } catch(error) {
        res.status(500).json({ status: false, msg: "Internal Error"})
    }
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
    const {company, position} = req.body
    if(!company || !position) {
        res.status(401).json({ status: false, msg: "Please provide company or position"})
    }
    try {
    const job = await Job.create(req.body)
    if(job) {
        return res.status(StatusCodes.CREATED).json({status: true, job: job})
    }
    res.status(400).json({ status: false, msg: "No job created, server error try again."})
    } catch(error) {
        console.log(error, "server error")
        res.status(500).json({ status: false, msg: "Internal Error"})
    }
}

const updateJob = async (req, res) => {
    const { body: { status }, user: { userId }, params: { id: jobId } } = req
    try {
         const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: userId }, {status: status}, { new: true, runValidators: true })
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
    } catch (error) {
        res.status(500).json({ status: false, msg: "Internal Error"})
    }
}

const deleteJob = async (req, res) => {
    const {user: { userId }, params: { id: jobId } } = req
    try {
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
    } catch(error) {
        res.status(500).json({ status: false, msg: "Internal Error"})
    }
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}