const express = require ("express")
const router =  express.Router();
const authMiddleware =require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const{
    createOrder,
    getAllOrders,
    getOrderById,
    getMyOrders,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");
const authorize = require("../middlewares/roleMiddleware");

// logged in user creates an order
router.post("/",authMiddleware,createOrder);

// loged in user views their own profile
router.get("/my-orders",authMiddleware,getMyOrders);

// admin views all orders
router.get("/",authMiddleware,authorize("admin"),getAllOrders);

// admin updates order status
router.put("/:id",authMiddleware,authorize("admin"),updateOrder);

// admin deletes an order
router.delete("/:id",authMiddleware,authorize("admin"),deleteOrder);

// user views an individual order (controller checks ownership)
router.get("/:id",authMiddleware,getOrderById)

module.exports= router;