import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as commentController from "../controllers/commentController";

const router = Router();

// POST /api/comments/:productId => Create a new comment for a product (PROTECTED)
router.post("/:productId", requireAuth(), commentController.createComment);

// DELETE /api/comments/:commentId => Delete a comment by ID (PROTECTED - only owner can delete)
router.delete("/:commentId", requireAuth(), commentController.deleteComment);

export default router;