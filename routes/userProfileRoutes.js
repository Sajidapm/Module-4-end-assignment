const express =require ("express")
const router =express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const authorize = require("../middlewares/roleMiddleware")
const { getProfile,
    updateProfile,
    deleteProfile,
    getUsers,
    deleteUser} =require ("../controllers/userProfile")

//   user get own profile

router.get("/profile",authMiddleware, getProfile);
   
// update own profile
router.put("/profile",authMiddleware,updateProfile);

// delete own profile
router.delete("/profile",authMiddleware,deleteProfile);

// Admin only
router.get("/admin",authMiddleware,authorize("admin"),(req,res)=>{
    res.json({
        success :true,
        message:"Welcome admin",
        user : req.user
    })
})
// get all users
router.get("/users",authMiddleware,authorize("admin"),getUsers);

// deleteany user
router.delete("/:id",authMiddleware,authorize("admin"),deleteUser)

module.exports = router;