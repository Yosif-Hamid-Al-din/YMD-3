const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
var {requireAuth} = require("../middleware/middleware");


router.get("",requireAuth, userController.user_add_get);
router.post("", userController.user_add_post);


module.exports = router