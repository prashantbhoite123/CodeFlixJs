import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Modal, Table, Button } from "flowbite-react"
import { Link } from "react-router-dom"
import { HiOutlineExclamationCircle } from "react-icons/hi"
export const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showmore, setShowmore] = useState(true)
  const [showModel, setShowModel] = useState(false)
  const [postIdDelete, setPostIdDelete] = useState("")
  
  useEffect(() => {
    const fetchposts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser._id}`,
          {
            method: "GET",
          }
        )
        const data = await res.json()
        if (res.ok) {
          setUserPosts(data.posts)
          if (data.posts.length < 9) {
            setShowmore(false)
          }
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (currentUser.isAdmin) {
      fetchposts()
    }
  }, [currentUser._id])

  const handelShowMore = async () => {
    const startIndex = userPosts.length

    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      )
      const data = await res.json()
      
      

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowmore(false)
        }
      }
    } catch (e) {
      onsole.log(e.message)
    }
  }

  const handelDeletePost = async () => {
    setShowModel(false)
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      )
      const data = await res.json()
      console.log(data)
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdDelete))
      }
    } catch (e) {
      console.log(e.message)
    }
  }
  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-red-100 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-500">
        {currentUser.isAdmin && userPosts.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {userPosts.map((post) => (
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-20 object-cover"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-gray-900 dark:text-white font-medium"
                        to={`/post/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModel(true)
                          setPostIdDelete(post._id)
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/update-post/${post._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
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
          <p> You have no Posts yet</p>
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
                Are You Sure You Want to Delete this post
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handelDeletePost}>
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
