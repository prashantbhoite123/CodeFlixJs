import React, { useEffect, useState } from "react"
import { FaThumbsUp } from "react-icons/fa"
import { Button, Textarea } from "flowbite-react"
import moment from "moment"
import { useSelector } from "react-redux"

function Comment({ comment, onLike, onEdit,onDelete }) {
  const { currentUser } = useSelector((state) => state.user)
  const [user, setUser] = useState({})
  const [editedContent, seteditedContent] = useState(comment.content)
  const [isEditing, setisEditing] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`)
        const data = await res.json()
        if (res.ok) {
          setUser(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [comment])

  const handelEdit = async () => {
    try {
      setisEditing(true)
      seteditedContent(comment.content)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handelSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      })
      if (res.ok) {
        setisEditing(false)
        onEdit(comment, editedContent)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="flex p-4 border-b dark:border-x-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePic}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              defaultValue={comment.content}
              className="mb-2"
              onChange={(e) => seteditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handelSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setisEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  `!text-blue-500`
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500"
                      onClick={handelEdit}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Comment
