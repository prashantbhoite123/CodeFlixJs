import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home.jsx"
import About from "./Pages/About.jsx"
import Dashboard from "./Pages/Dashboard.jsx"
import SignUp from "./Pages/SignUp.jsx"
import Singin from "./Pages/Singin.jsx"
import Projects from "./Pages/Projects.jsx"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import ProtectRouter from "./components/ProtectRouter.jsx"
import OnlyAdminProtectRoute from "./components/OnlyAdminProtectRoute.jsx"
import CreatePost from "./Pages/CreatePost.jsx"
import UpdatePost from "./Pages/UpdatePost.jsx"
import PostPage from "./Pages/PostPage.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import Search from "./Pages/Search.jsx"

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<Singin />} />
          <Route path="/search" element={<Search />} />
          <Route element={<ProtectRouter />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminProtectRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
