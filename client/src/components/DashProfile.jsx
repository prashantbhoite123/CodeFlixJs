import { Alert, Button, Modal, TextInput } from "flowbite-react"
import React, { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import {
  updateStart,
  updateFail,
  updateSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signOutSuccess,
} from "../App/user/UserSlice"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { app } from "../firebase"
import { HiOutlineExclamationCircle } from "react-icons/hi"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

function DashProfile() {
  const dispatch = useDispatch()

  const { currentUser, error, loading } = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setimageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setimageFileUploadError] = useState(null)
  const [imagefileUploading, setimageFileUploading] = useState(false)
  const [updateUserSuccess, setupdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModel, setShowModel] = useState(false)
  const [fromdata, setFromData] = useState({})
  // console.log(imageFileUrl)
  console.log(fromdata)

  const filePickerRef = useRef()
  const handelImageChange = (e) => {
    const files = e.target.files[0]
    if (files) {
      setImageFile(files)
      setImageFileUrl(URL.createObjectURL(files))
    }
  }
  useEffect(() => {
    if (imageFile) {
      uploadingImg()
    }
  }, [imageFileUrl])

  const uploadingImg = () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write:if
    //       request.resource.size < 2*1024*1024&&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setimageFileUploading(true)
    setimageFileUploadError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setimageFileUploadProgress(progress.toFixed(0))
      },
      (error) => {
        console.log(`Errororoorrrr ::: `, error)
        setimageFileUploadError(
          `Colud not Upload image (file Must be less then 2MB) `
        )
        setimageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setimageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl)
          console.log("download", downloadUrl)
          setFromData({ ...fromdata, profilePic: downloadUrl })
          setimageFileUploading(false)
          setImageFile("")
        })
      }
    )
  }
  const handelChange = (e) => {
    setFromData({ ...fromdata, [e.target.id]: e.target.value })
  }

  const handelUpdate = async (e) => {
    e.preventDefault()
    if (Object.keys(fromdata).length === 0) {
      setUpdateUserError("No changes Made")

      return
    }
    if (imagefileUploading) {
      setUpdateUserError("Please Wait for image to Upload")
      setupdateUserSuccess(null)
      return
    }
    try {
      dispatch(updateStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(fromdata),
      })
      const data = await res.json()
      console.log("", data)
      if (!res.ok) {
        dispatch(updateFail(data.message))
        setUpdateUserError(data.message)
        setupdateUserSuccess(null)
      } else {
        dispatch(updateSuccess(data))
        setupdateUserSuccess("User's Profile Update SuccsessFully ")
        setUpdateUserError(null)
      }
    } catch (error) {
      dispatch(updateFail(error.message))
      setUpdateUserError(data.message)
    }
  }

  const handelDelete = async () => {
    setShowModel(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(deleteUserFail(data.message))
      } else {
        dispatch(deleteUserSuccess(data))
      }
    } catch (e) {
      dispatch(deleteUserFail(e.message))
    }
  }

  const handelSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signOutSuccess())
      }
    } catch (e) {
      console.log(e.message)
    }
  }
  return (
    <>
      <div className="max-w-lg mx-auto p-3 w-full ">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handelUpdate}>
          <input
            type="file"
            accept="image/*"
            onChange={handelImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && imageFileUploadProgress < 100 && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePic}
              alt="User"
              className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                `opacity-60`
              }`}
            />
          </div>
          {imageFileUploadError && (
            <Alert color="failure">{imageFileUploadError}</Alert>
          )}
          <TextInput
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username}
            onChange={handelChange}
          />
          <TextInput
            type="email"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email}
            onChange={handelChange}
          />
          <TextInput
            type="password"
            id="password"
            placeholder="Password"
            onChange={handelChange}
          />
          <Button
            type="submit"
            gradientDuoTone={"purpleToBlue"}
            outline
            disabled={loading || imagefileUploading}
          >
            {loading ? "loading ..." : "Update"}
          </Button>

          {currentUser.isAdmin && (
            <Link to={"/create-post"}>
              <Button
                type="button"
                gradientDuoTone="purpleToPink"
                className="w-full"
              >
                Create a Post
              </Button>
            </Link>
          )}
          <div className="flex justify-between">
            <Button
              outline
              className="cursor-pointer"
              onClick={() => setShowModel(true)}
            >
              Delete
            </Button>
            <Button onClick={handelSignOut} outline className="cursor-pointer">
              Sign-Out
            </Button>
          </div>
        </form>
        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="success" className="mt-5">
            {error}
          </Alert>
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
                Are You Sure You Want to Delete Your Account
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handelDelete}>
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

export default DashProfile
