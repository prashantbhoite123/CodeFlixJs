import { Comment } from "../Models/comment.model.js"
import { errorHandler } from "../utils/error.handler.js"

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You have not allowed to create this comment")
      )
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    })

    await newComment.save()

    res.status(200).json(newComment)
  } catch (error) {
    next(error)
  }
}

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    })
    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return next(errorHandler(404, "Comment not found"))
    }
    const userIndex = comment.likes.indexOf(req.user.id)
    if (userIndex === -1) {
      comment.numberOfLikes += 1
      comment.likes.push(req.user.id)
    } else {
      comment.numberOfLikes -= 1
      comment.likes.splice(userIndex, 1)
    }
    await comment.save()
  } catch (error) {
    next(error)
  }
}

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return next(errorHandler(404, "Comment not found"))
    }

    if (comment._id !== req.user.id && req.user.isAdmin === false) {
      return next(403, "You are not allowed to edit this comment")
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $set: {
          content: req.body.content,
        },
      },
      { new: true }
    )

    res.status(200).json(editedComment)
  } catch (e) {
    next(e)
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const delComment = await Comment.findById(req.params.commentId)
    if (!delComment) {
      return next(errorHandler(403, " Comment not found "))
    }

    if (delComment._id !== req.user.id && delComment.isAdmin === false) {
      return next(errorHandler(401, "You are not allow to delete this Comment"))
    }

    await Comment.findByIdAndDelete(req.params.commentId)

    res.status(200).json("Comment has been deleted")
  } catch (error) {
    next(error)
  }
}

export const getcomment = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Your Not allow to get all Comments"))
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const shortDirection = req.query.short === "desc" ? -1 : 1

    const comment = await Comment.find()
      .sort({ createdAt: shortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalComment = await Comment.countDocuments()
    const now = new Date()

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({ comment, totalComment, lastMonthComments })
  } catch (error) {
    next(error)
  }
}
