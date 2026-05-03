import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const router = Router();

// GET /api/products => Get all products(PUBLIC)
router.get("/", productController.getAllProducts);

// GET /api/products/my => Get products of the current user (PROTECTED)
router.get("/my", requireAuth(), productController.getMyProducts);

// GET /api/products/:id => Get a single product by ID (PUBLIC)
router.get("/:id", productController.getProductById);

// POST /api/products => Create a new product (PROTECTED)
router.post("/", requireAuth(), productController.createProduct);

// PUT /api/products/:id => Update a product by ID (PROTECTED)
router.put("/:id", requireAuth(), productController.updateProduct);

// DELETE /api/products/:id => Delete a product by ID (PROTECTED)
router.delete("/:id", requireAuth(), productController.deleteProduct);

export default router;