const mongoose = require("mongoose")
const Order = require("../model/Order")
const Product=require("../model/Product")


// create an order
const createOrder = async(req,res,next)=>{
    try {
        const {products,shippingAddress} = req.body;
        if(!Array.isArray(products) || products.length===0){
          res.status(404).json({
            success:false,
            message:"Pleaase add at least one product"
          })
        }
        if(!shippingAddress || !shippingAddress.trim()){
            return res.status(400).json({
                success: false,
                message:"Shipping address is required "
            })
        }
        let totalAmount = 0;
        const orderProducts = [];
         for (const item of products) {
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be a positive integer"
                });
            }

        const product = await Product.findById(item.product)

        if(!product){
            return res.status(404).json({
                success : false,
                message:`Product not found:${item.product}`
            })
        }

        const price = product.price;


        orderProducts.push({
            product:product._id,
            quantity:item.quantity,
            price
        })
        totalAmount += price * item.quantity;
    }
    
    const order = await Order.create({
        user:req.user.id || req.user._id,
        products : orderProducts,
        totalAmount,
        shippingAddress : shippingAddress.trim(),
    })
    return res.status(200).json({
        success:true,
        message:"Order created successfully",
        data: order
    })
    } catch (error) {
        next(error)
    }
};

// get all orders, admin only
const getAllOrders = async (req,res,next)=>{
    try {
        const orders = await Order.find()
        .populate("user", "name email")
        .populate("products.product","name price")
        .sort({createdAt: -1});

        return res.status(200).json({
            success:true,
            count: orders.length,
            data:orders
        })
    } catch (error) {
        next(error)
    }

};

// get an order by id
const getOrderById =async(req,res,next)=>{
    try {
        const {id} = req.params
        
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findById(id)
        .populate("user", "name email").populate("products.product","name price")
        
        if(!order){
            return res.satus(404).json({
                success:false,
                 message:"Order not found"
            })

        }

        // users can access only their own orders ,admin can access any orders

        const userId = req.user.id  ||  req.user._id;
        const isOwner = order.user._id.toString() === userId.toString()

        if(req.user.role !=="admin" && !isOwner){
            return res.status(403).json({
                success :false,
                message:"You are not allowed to access this order"
            })
        }
        return res.status(200).json({
            success:true,
            data : order
        })
    } catch (error) {
        next (error)
    }
}

// 4. Get logged-in user's orders
const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;

        const orders = await Order.find({ user: userId })
            .populate("products.product", "name price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// 5. Update order status (admin only)
const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: "after", runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// 6. Delete order (admin only)
const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
module.exports ={
    createOrder,
    getAllOrders,
    getOrderById,
    getMyOrders,
    updateOrder,
    deleteOrder
}