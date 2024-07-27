import {
  Select,
  TextInput,
  FileInput,
  Button,
  Alert,
  ListGroup,
} from "flowbite-react"
import React, { useEffect, useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from "react-circular-progressbar"

function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setimageUploadProgress] = useState(null)
  const [imageUploadError, setimageUploadError] = useState(null)
  const [fromData, setFromData] = useState({})
  const [PublishError, setPublishError] = useState(null)
  const { postId } = useParams()

  const mavigate = useNavigate()

  useEffect(() => {
    try {
      const fetchpost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        const data = await res.json()
        console.log(data)
        if (!res.ok) {
          console.log(data.message)
          setPublishError(data.message)
          return
        }
        if (res.ok) {
          setPublishError(null)
          setFromData(data.posts[0])
        }
      }
      fetchpost()
    } catch (e) {
      console.log(e.message)
    }
  }, [postId])

  const handelUploadImage = async () => {
    try {
      if (!file) {
        setimageUploadError("Please select an image")
        return
      }
      setimageUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + "-" + file.name
      const storageref = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageref, file)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setimageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          setimageUploadError("Image upload failed")
          setimageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageUploadProgress(null)
            setimageUploadError(null)
            setFromData({ ...fromData, image: downloadURL })
          })
        }
      )
    } catch (e) {
      setimageUploadError("Image upload failed")
      setimageUploadProgress(null)
      console.log(e)
    }
  }

  const handelSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(
        `/api/post/updatepost/${fromData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(fromData),
        }
      )
      const data = await res.json()
      if (data.success === false) {
        setPublishError(data.message)
        return
      }
      if (!res.ok) {
        setPublishError(data.message)
        return
      }
      if (res.ok) {
        console.log("this is the data ", data)
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }
    } catch (e) {
      setPublishError(`something went wrong ${e}`)
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handelSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title "
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFromData({ ...fromData, title: e.target.value })
            }
            value={fromData.title}
          />
          <Select
            onChange={(e) =>
              setFromData({ ...fromData, category: e.target.value })
            }
            value={fromData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nexts">Next.js</option>
          </Select>
        </div>
        <div className="flex fap-4  items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handelUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {fromData.image && (
          <img
            src={fromData.image}
            alt="upload"
            className="w-full h-72  object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={fromData.content}
          placeholder="Write something...."
          className="h-72 mb-12"
          required
          onChange={(value) => setFromData({ ...fromData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
        {PublishError && (
          <Alert className="mt-5" color="failure">
            {PublishError}
          </Alert>
        )}
      </form>
    </div>
  )
}

export default UpdatePost
