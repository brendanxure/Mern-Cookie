const express = require('express')
const { Register, Login, UpdateProfile, UserProfile } = require('../controllers/userController')
const router = express.Router()

router.post('/register', Register)
router.post('/login', Login)
router.route('/profile').get(UserProfile).put(UpdateProfile)

module.exports = router