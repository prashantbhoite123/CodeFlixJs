import { Button, Spinner } from "flowbite-react"
import React from "react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from "../firebase"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { SignInstart, signSuccess, signinFail } from "../App/user/UserSlice"
function OAuth() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const handelGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: "select_account" })
    const auth = getAuth(app)
    try {
      dispatch(SignInstart())
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const res = await fetch("/api/auth/googleAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
        }),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signinFail(data.message))
      }

      console.log(data)
      if (res.ok) {
        dispatch(signSuccess(data))
        navigate("/")
      }
    } catch (e) {
      dispatch(signinFail(e.message))
    }
  }
  return (
    <Button
      disabled={loading}
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handelGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      <span className="font-semibold text-md gap-3">
        {loading ? (
          <>
            <Spinner size={"md"} />
            <span className="pl-3 text-lg">Loading...</span>
          </>
        ) : (
          "Continue With Google"
        )}
      </span>
    </Button>
  )
}

export default OAuth
