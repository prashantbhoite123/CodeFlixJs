import { Alert, Button, Label, Spinner, TextInput, Toast } from "flowbite-react"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth"

function SignUp() {
  const navigate = useNavigate()
  const [fromData, setFromData] = useState([])
  const [errorMessage, setErrorMessage] = useState([])
  const [loading, setloading] = useState(false)
  console.log(fromData)

  const handelChange = (e) => {
    setFromData({ ...fromData, [e.target.name]: e.target.value.trim() })
  }

  const handelSubmit = async (e) => {
    e.preventDefault()
    if (!fromData.username || !fromData.email || !fromData.password) {
      return setErrorMessage("Please Fill up all the Filds")
    }
    try {
      setloading(true)
      setErrorMessage(null)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fromData),
      })
      const data = await res.json()
      if (data.success === false) {
        setloading(false)
        return setErrorMessage(data.message)
      }
      setloading(false)

      if (res.ok) {
        navigate("/sign-in")
      }
    } catch (error) {
      setErrorMessage(error.message)
      setloading(false)
    }
  }
  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* left side */}
          <div className="flex-1">
            <Link to={"/"} className="text-4xl font-bold dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Coding
              </span>
              Blog
            </Link>
            <p className="text-sm mt-5">
              This Coding blog Application for WebDevlopers. You can singin Your
              email and passowrd and Google
            </p>
          </div>
          {/*Right side*/}
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handelSubmit}>
              <div className="">
                <Label value="Your Username" />
                <TextInput
                  type="text"
                  id="username"
                  value={fromData.username}
                  name="username"
                  placeholder="Username.."
                  onChange={handelChange}
                />
              </div>
              <div className="">
                <Label value="Your Email" />
                <TextInput
                  type="email"
                  id="email"
                  name="email"
                  value={fromData.email}
                  placeholder="name@company.com"
                  onChange={handelChange}
                />
              </div>
              <div className="">
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  id="password"
                  value={fromData.password}
                  name="password"
                  placeholder="Password.."
                  onChange={handelChange}
                />
              </div>
              <Button
                gradientDuoTone={"purpleToPink"}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size={"md"} />
                    <span className="pl-3 text-lg">Loading...</span>
                  </>
                ) : (
                  "SIGN-UP"
                )}
                {/* SIGN-UP */}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account ?</span>
              <Link to={"/sign-in"} className="text-blue-500 ">
                Sign In
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5 " color={"failure"}>
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
