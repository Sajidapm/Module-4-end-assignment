const express= require("express")
const router =express.Router();

const authMiddleware=require("../middlewares/authMiddleware")
const authorize= require ("../middlewares/roleMiddleware");

const {
    createProduct,getProduct,getProducts,updateProduct,deleteProduct
}= require("../controllers/productController");

// Public routes 
router.get("/",getProducts);
router.get("/:id",getProduct)

// admin only routes
router.post("/",authMiddleware,authorize("admin"),createProduct);
router.put("/:id",authMiddleware,authorize("admin"),updateProduct);
router.delete("/:id",authMiddleware,authorize("admin"),deleteProduct);

module.exports = router