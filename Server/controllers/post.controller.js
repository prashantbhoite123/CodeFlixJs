import Post from "../Models/post.model.js"
import { errorHandler } from "../utils/error.handler.js"

export const create = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Your not allow to create a post"))
    }
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "please provide all required fields"))
    }
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "-")

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    })
    const savedPost = await newPost.save()
    res.status(201).json(savedPost)
  } catch (e) {
    next(e)
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const startindex = parseInt(req.query.startIndex) || 0

    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === "asc" ? 1 : -1
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startindex)
      .limit(limit)

    const totalPost = await Post.countDocuments()

    const now = new Date()

    const oneMonthago = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthago },
    })

    res.status(200).json({
      posts,
      totalPost,
      lastMonthPosts,
    })
  } catch (error) {
    next(error)
  }
}

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"))
  }

  try {
    await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json("this post has been deleted")
  } catch (error) {
    next(error)
  }
}

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to Update this post"))
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    )

    res.status(200).json(updatedPost)
  } catch (e) {
    return next(errorHandler(400, `Error While updatePost Api :${e}`))
  }
}
