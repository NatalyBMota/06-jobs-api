const express = require('express')

const router = express.Router()
const {
    createJob, 
    deleteJob,
    getAllJobs,
    getNewJobForm,
    updateJob,  
    getJob, 
} = require('../controllers/jobs')

router.route('/').post(createJob).get(getAllJobs)
// router.get('/new', getNewJobForm)
router.route('/new').get(getNewJobForm)
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router