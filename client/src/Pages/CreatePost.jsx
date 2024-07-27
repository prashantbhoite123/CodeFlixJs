import { Select, TextInput, FileInput, Button, Alert } from "flowbite-react"
import React, { useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from "react-circular-progressbar"
import { useNavigate } from "react-router-dom"

function CreatePost() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setimageUploadProgress] = useState(null)
  const [imageUploadError, setimageUploadError] = useState(null)
  const [fromData, setFromData] = useState({})
  const [PublishError, setPublishError] = useState(null)

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
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(fromData),
      })
      const data = await res.json()
      if (data.success === false) {
        setPublishError(data.message)
        return
      }
      if (!res.ok) {
        setPublishError(data.message)
        return
      } else {
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }
    } catch (e) {
      setPublishError("something went wrong")
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
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
          />
          <Select
            onChange={(e) =>
              setFromData({ ...fromData, category: e.target.value })
            }
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
          placeholder="Write something...."
          className="h-72 mb-12"
          required
          onChange={(value) => setFromData({ ...fromData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
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

export default CreatePost
