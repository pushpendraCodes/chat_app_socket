
const express = require("express")
const { login, register,setAvatar, getAllUsers, logOut } = require("../controllers/authControllers")
const router = express.Router()



router.post("/login"  , login  )
router.post("/register"  , register  )
router.post("/setavatar/:id"  , setAvatar  )
router.get("/allusers/:id"  , getAllUsers  )
router.post("/logout/:id"  , logOut  )

module.exports = router