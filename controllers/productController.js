const Product =require("../model/Product")

// create products
const createProduct = async(req,res,next)=>{
    try {
        const {name,description,category,price,stock,rating} = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            rating
        })
        res.status(201).json({
            success:true,
            message:"Product added successfully",
            data:product
        })
    } catch (error) {
        next(error);
    }
};

// Get all products

const getProducts = async(req,res,next)=>{
    try {
          const {
            search,
            category,
            minPrice,
            maxPrice,
            sort
          }= req.query;

        //   Build filter
        const filter ={};

        // search by name
        if (search){
            filter.name={$regex:search,$options:"i"}
        }

        // filter by category
        if(category){
            filter.category={$regex:`^${category}$`,$options:"i"}
            
        }

        // pricefilter
        if(minPrice || maxPrice){
            filter.price ={};

            if(minPrice){
                filter.price.$gte = Number(minPrice);
            }
            if(maxPrice){
                filter.price.$lte = Number(maxPrice);
            }
        }

        // sorting
        let sortOption ={};
        if(sort==="price_asc"){
            sortOption.price = 1;}

            if(sort==="price_desc"){
                sortOption.price= -1
            }

            if (sort==="rating_desc"){
                sortOption.rating= -1;
            }



        const products= await Product.find(filter).sort(sortOption);

        res.status(200).json({
            success:true,
            count:products.length,
            data:products
        })
    } catch (error) {
        next(error)
    }
}

// Get single product
const getProduct= async(req,res,next)=>{
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(400).json({
                success :false,
                message:"Product not found"
            })
        }
        res.status(200).json({
            success:true,
            data:product 
        })

    } catch (error) {
      next(error) 
    }
}

// Update product
const updateProduct= async(req,res,next)=>{
    try {
        const product=await Product.findByIdAndUpdate(
            req.params.id,req.body,{new:true,runValidators:true}
        )

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        res.status(200).json({
            success :true,
            message:"Product updated successfully",
            data:product
        })
    } catch (error) {
        next(error)
    }

}

// Delete product

const deleteProduct = async(req,res,next)=>{
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
       if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        res.status(200).json({
            success :true,
            message:"Product deleted successfully"
        })

    } catch (error) {
        next(error)
    }
}

module.exports ={
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}