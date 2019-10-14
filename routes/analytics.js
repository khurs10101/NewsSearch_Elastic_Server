const express= require('express')
const router= express.Router()

const customAnalytics= require('../controllers/analytics')

router.post('/analytics', customAnalytics.customAnalytics)

module.exports= router