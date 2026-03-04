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
router.route('/new').get(getNewJobForm)
router.route('/edit/:id').get(getJob)
router.route('/update/:id').post(updateJob)
router.route('/delete/:id').post(deleteJob)
// router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)
router.route('/:id').get(getJob).patch(updateJob)

module.exports = router