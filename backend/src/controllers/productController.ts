import type { Request, Response } from "express";
import * as queries from "../db/queries"
import { getAuth } from "@clerk/express";


interface Params {
    [key: string]: string;
    id: string;
}

// GET all products (PUBLIC)
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await queries.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "An error occurred while fetching products" });
    }
};


// GET a single product by ID (PUBLIC)
export const getProductById = async (req: Request<Params>, res: Response) => {
    try {
        const { id } = req.params;
        const product = await queries.getProductById(id);

        if(!product) return res.status(404).json({ error: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "An error occurred while fetching the product" });
    }
};


// GET products by current user (PROTECTED)
export const getMyProducts = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if(!userId) return res.status(401).json({ error: "Unauthorized" });

        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching user's products:", error);
        res.status(500).json({ error: "An error occurred while fetching user's products" });
    }
};


// POST create a new product (PROTECTED)
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if(!userId) return res.status(401).json({ error: "Unauthorized" });

        const { title, description, imageUrl } = req.body;

        if(!title || !description || !imageUrl) {
            return res.status(400).json({ error: "Title, description and imageUrl are required" });
        };

        const product = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "An error occurred while creating the product" });
    }
};

// UPDATE product (PROTECTED - only owner can update)
export const updateProduct = async (req: Request<Params>, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if(!userId) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.params;
        const { title, description, imageUrl } = req.body;

        // Check if the product exists and belongs to the user
        const existingProduct = await queries.getProductById(id);
        if( !existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        if( existingProduct.userId !== userId) {
            return res.status(403).json({ error: "Forbidden - You can only update your own products" });
        }

        const product = await queries.updateProduct(id, {
            title,
            description,
            imageUrl,
        });
        res.status(200).json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "An error occurred while updating the product" });
    }
};


// DELETE product (PROTECTED - only owner can delete)
export const deleteProduct = async (req: Request<Params>, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if(!userId) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.params;

        // Check if the product exists and belongs to the user
        const existingProduct = await queries.getProductById(id);
        if( !existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        };

        if( existingProduct.userId !== userId) {
            return res.status(403).json({ error: "Forbidden - You can only delete your own products" });
        };

        await queries.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "An error occurred while deleting the product" });
    }
};