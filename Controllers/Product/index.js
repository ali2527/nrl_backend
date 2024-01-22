//Models
const User = require("../../Models/User");
const Product = require("../../Models/Product");
const fs = require("fs");

//Helpers
const { generateToken } = require("../../Helpers/index");
const { ApiResponse } = require("../../Helpers/index");
const { validateToken } = require("../../Helpers/index");
const { generateString } = require("../../Helpers/index");
const { errorHandler } = require("../../Helpers/errorHandler");
const { generateEmail } = require("../../Helpers/email");
const sanitizeUser = require("../../Helpers/sanitizeUser");
const {
  createResetToken,
  validateResetToken,
} = require("../../Helpers/verification");

//addProduct
exports.addProduct = async (req, res) => {
  const {title, description, price, stock, category, variations } =
    req.body;
  

  try {
  const product = new Product({
      title,
      description,
      price,
      stock,
      category,
      image:req.files.image ? req.files.image[0].filename : "",
      gallery:req.files.gallery ? req.files.gallery.map(item => item.filename) : "",
      variations: variations ? JSON.parse(variations) : [],
    });

    await product.save();

    return res.status(200).json(
      ApiResponse(
        { Product },

        "Product Created Successfully",
        true
      )
    );
  } catch (error) {
    return res.json(
      ApiResponse(
        {},
        errorHandler(error) ? errorHandler(error) : error.message,
        false
      )
    );
  }
};


//get All product
exports.getAllProducts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let finalAggregate = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
    ];

    if (req.query) {
      if (req.query.keyword) {
        finalAggregate.push({
          $match: {
            $or: [
              {
                title: {
                  $regex: ".*" + req.query.keyword.toLowerCase() + ".*",
                  $options: "i",
                },
                description: {
                  $regex: ".*" + req.query.keyword.toLowerCase() + ".*",
                  $options: "i",
                },
              },
            ],
          },
        });
      }
      if (req.query.category) {
        finalAggregate.push({
          $match: {
            category: req.query.category,
          },
        });
      }
      if (req.query.status) {
        finalAggregate.push({
          $match: {
            status: req.query.status,
          },
        });
      }
    }

    const myAggregate =
      finalAggregate.length > 0
        ? Product.aggregate(finalAggregate)
        : Product.aggregate([]);

    Product.aggregatePaginate(myAggregate, { page, limit }).then((products) => {
      res.json(ApiResponse(products));
    });
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.json(ApiResponse({}, "Product not found", true));
    }

    return res.json(ApiResponse({ product }, "", true));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Get product by Category
exports.getProductByCategory = async (req, res) => {
  try {
    const products = await Product.findOne({ category: req.params.id });

    if (!products) {
      return res.json(ApiResponse({}, "Products not found", true));
    }

    return res.json(ApiResponse({ products }, "", true));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

//update product
exports.updateProduct = async (req, res) => {
  try {
      let product = await Product.findById(req.params.id);
      let oldImages = req.body.oldImages ? JSON.parse(req.body.oldImages) : [];
      let allImages = []
      
      product.title = req.body.title ? req.body.title : (product.title || "");
      product.description = req.body.description ? req.body.description : (product.description || "");
      product.price = req.body.price ? req.body.price : (product.price || 0);
      product.category = req.body.category ? req.body.category : (product.category || "")
      product.variations = req.body.variations ?  JSON.parse(req.body.variations) : (product.variations || [])
      
      let temp = req.files.gallery ? req.files.gallery.map(item => item.filename) : []
      allImages = [...product.gallery,...temp];
      
      if (oldImages && oldImages.length > 0) {

      oldImages.map(item => {
        const filePath = `./Uploads/${item}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      }
      
        product.gallery = allImages.filter(image => !oldImages.includes(image)) || []


 await product.save();
    return res.json(ApiResponse(product, "Product updated successfully"));
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) {
      return res.json(ApiResponse({}, "Product not found", false));
    }

    return res.json(ApiResponse({}, "Product Deleted Successfully", true));
  } catch (error) {
    return res.json(
      ApiResponse(
        {},
        errorHandler(error) ? errorHandler(error) : error.message,
        false
      )
    );
  }
};

//purchase product
exports.purchaseProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) {
      return res.json(ApiResponse({}, "Product not found", false));
    }

    return res.json(ApiResponse({}, "Product Deleted Successfully", true));
  } catch (error) {
    return res.json(
      ApiResponse(
        {},
        errorHandler(error) ? errorHandler(error) : error.message,
        false
      )
    );
  }
};

