import express from 'express'
import { createNotification, deleteNotification, findFilteredNotifications, findSingleNotification, getAllNotifications, toggleNotification } from '../../controllers/dashboard/notification.js';
const router = express();

//Route to get all notifications
router.get('/notification/all',getAllNotifications)
//Route to get fileterd notifications(by type or user id or (user id + patient,disease id))
router.get('/notification/filter',findFilteredNotifications)
//Route to get single notification by id
router.get('/notification/:id',findSingleNotification)
//Route to create new notification 
router.post('/notification/new/:type/:id',createNotification)
//Route to delete an notification
router.delete('/notification/:id',deleteNotification)
//Router to toggle notfication read status
router.put('/notification/:id',toggleNotification)

export default router



//Target for 19 march is to complete the basic api and understand the flow of it.