import { Button, Select, TextInput } from "flowbite-react"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import PostCard from "../components/PostCard"

function Search() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarData, setSidebarData] = useState({
    searchTearm: "",
    sort: "desc",
    category: "uncategorized",
  })
  console.log(sidebarData)
  const [post, setPost] = useState([])
  console.log(post)
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTearmFromUrl = urlParams.get("searchTerm")
    const sortFromUrl = urlParams.get("sort")
    const categoryFromUrl = urlParams.get("category")
    if (searchTearmFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTearm: searchTearmFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      })
    }

    const fetchPost = async () => {
      setLoading(true)

      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/post/getposts?${searchQuery}`)
      if (!res.ok) {
        setLoading(false)
        return
      }
      if (res.ok) {
        const data = await res.json()
        setPost(data.posts)
        setLoading(false)
        if (data.posts.length === 0) {
          setShowMore(true)
        } else {
          setShowMore(false)
        }
      }
    }
    fetchPost()
  }, [location.search])

  const handelChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value })
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc"
      setSidebarData({ ...sidebarData, sort: order })
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized"
      setSidebarData({ ...sidebarData, category })
    }
  }

  const handelSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTerm", sidebarData.searchTearm)
    urlParams.set("sort", sidebarData.sort)
    urlParams.set("category", sidebarData.category)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handelSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Tearm :
            </label>
            <TextInput
              placeholder="Search ..."
              type="text"
              id="searchTerm"
              value={sidebarData.searchTearm}
              onChange={handelChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort : </label>
            <Select onChange={handelChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category : </label>
            <Select
              onChange={handelChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">Javascript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>

      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Post Result :
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && post.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}

          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            post &&
            post.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  )
}

export default Search
