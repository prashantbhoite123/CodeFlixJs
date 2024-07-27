import { Button } from "flowbite-react"
import React from "react"
import { Link } from "react-router-dom"
function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl">
      <div className="flex-1  justify-center flex flex-col">
        <h2 className="text-2xl ">Want to learn more about JavaScript? </h2>
        <p className="text-gray-500 my-2">
          CheckOut these resources with 100 JavaScript Projects{" "}
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <Link to="/search" rel="noopener noreferrer">
            Learn More
          </Link>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto" />
      </div>
    </div>
  )
}

export default CallToAction
