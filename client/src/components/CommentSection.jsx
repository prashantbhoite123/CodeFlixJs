import { Alert, Button, Modal, Textarea } from "flowbite-react"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Comment from "./Comment"
import { HiOutlineExclamationCircle } from "react-icons/hi"

function CommentSection({ postId }) {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [comment, setComment] = useState("")
  const [commentError, setcommentError] = useState(null)
  const [comments, setComments] = useState([])
  const [showModel, setShowModel] = useState(false)
  const [commentToDelete, setcommentToDelete] = useState(null)

  const handelSubmit = async (e) => {
    e.preventDefault()
    if (comment.length > 200) {
      return
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setComment("")
        setcommentError(null)
        setComments([data, ...comments])
      }
    } catch (error) {
      setcommentError(error.message)
    }
  }

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comment/getpostcomments/${postId}`)
        if (res.ok) {
          const data = await res.json()

          setComments(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchComment()
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in")
        return
      }

      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handelEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    )
  }

  const handelDelete = async (commentId) => {
    setShowModel(false)
    try {
      if (!currentUser) {
        navigate("/sign-in")
        return
      }
      const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (res.ok) {
        const data = await res.json()

        setComments(comments.filter((comment) => comment._id !== commentId))
        setShowModel(false)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="max-w-2xl w-full mx-auto p-3 ">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signned in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePic}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 ">
          You must be signed in to comment
          <Link className="text-blue-500 hover:underline" to={"/sing-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handelSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} charecters remaining
            </p>
            <Button gradientDuoTone="purpleToBlue" outline type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comments Yet !</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p className="">{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handelEdit}
              onDelete={(commentId) => {
                setShowModel(true)
                setcommentToDelete(commentId)
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400  dark:text-gray-200 mx-auto mb-4" />
            <h3 className="mb-5 text-gray-500 text-lg dark:text-gray-400">
              Are You Sure You Want to Delete this Comment
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handelDelete(commentToDelete)}
              >
                Yes, I'm Sure
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSection
