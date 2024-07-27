import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Modal, Table, Button } from "flowbite-react"
import { HiOutlineExclamationCircle } from "react-icons/hi"
import { FaCheck, FaTimes } from "react-icons/fa"

function DashComments() {
  const { currentUser } = useSelector((state) => state.user)
  const [comment, setComment] = useState([])
  const [showmore, setShowmore] = useState(true)
  const [showModel, setShowModel] = useState(false)
  const [commentIdDeleted, setcommentIdDeleted] = useState("")

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comment/getcomment`, {
          method: "GET",
        })
        const data = await res.json()
        if (res.ok) {
          setComment(data.comment)
          if (data.comment.length < 5) {
            setShowmore(false)
          }
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (currentUser.isAdmin) {
      fetchComment()
    }
  }, [currentUser._id])

  const handelShowMore = async () => {
    const startIndex = comment.length

    try {
      const res = await fetch(
        `/api/comment/getcomment?startIndex=${startIndex}`
      )
      const data = await res.json()
      console.log("show more data", data)

      if (res.ok) {
        setComment((prev) => [...prev, ...data.comment])
        if (data.comment.length < 5) {
          setShowmore(false)
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const handelDeleteComment = async () => {
    setShowModel(false)
    try {
      const res = await fetch(`api/comment/deletecomment/${commentIdDeleted}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok) {
        setComment((prev) =>
          prev.filter((user) => user._id !== commentIdDeleted)
        )
        setShowModel(false)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-red-100 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-500">
        {currentUser.isAdmin && comment.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number Of Likes</Table.HeadCell>
                <Table.HeadCell>Post Id</Table.HeadCell>
                <Table.HeadCell>User Id</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {comment.map((comment) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={comment._id}
                  >
                    <Table.Cell>
                      {new Date(comment.UpdatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModel(true)
                          setcommentIdDeleted(comment._id)
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {showmore && (
              <button
                className="w-full text-teal-500 self-center text-sm py-7"
                onClick={handelShowMore}
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p> You have no Comment yet</p>
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
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-4" />
              <h3 className="mb-5 text-gray-500 text-lg dark:text-gray-400">
                Are You Sure You Want to Delete this User?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handelDeleteComment}>
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
    </>
  )
}

export default DashComments
