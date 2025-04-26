import express from 'express'
import { createAlert, deleteAlert, findFilteredAlerts, findSingleAlert, getAllAlerts, toggleAlert } from '../../controllers/dashboard/alert.js';
const router = express();

//Route to get all alerts
router.get('/alert/all',getAllAlerts)
//Route to get fileterd alerts(by type or user id or (user id + patient,disease id))
router.get('/alert/filter',findFilteredAlerts)
//Route to get single alert by id
router.get('/alert/:id',findSingleAlert)
//Route to create new alert 
router.post('/alert/new/:type/:id',createAlert)
//Route to delete an alert
router.delete('/alert/:id',deleteAlert)
//Route to toggle alert active status
router.put('/alert/:id',toggleAlert)

export default router



//Target for 19 march is to complete the basic api and understand the flow of it.