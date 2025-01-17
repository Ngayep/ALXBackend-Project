import React, { useEffect, useState } from "react";
import PostList from "../components/Dashboard/PostList";
import PostForm from "../components/Dashboard/PostForm";
import Pagination from "../components/Shared/Pagination";

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPost, setEditingPost] = useState(null);

  const postsPerPage = 5; // Number of posts to display per page

  const fetchPosts = async (page) => {
   try {
    // Fetch posts from the backend
     const response = await fetch("/api/posts?page=${page}&limit=${postsPerPage}");
     const data = await response.json();
     setPosts(data.posts); // Assume `data.posts` contains the posts for the current page
     setTotalPages(data.totalPages); // Assume `data.totalPages` is provided by the backend
   } catch (error) {
     console.error("Error fetching posts:", error);
   }
};

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPosts(newPage);
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleCreateOrUpdate = (post) => {
    console.log("Create or Update Post:", post);
    // Handle create or update logic
  };

  const handleDelete = (postId) => {
    console.log("Delete Post:", postId);
    // Handle delete logic
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <PostList posts={posts} onEdit={setEditingPost} onDelete={handleDelete} />
      <PostForm post={editingPost} onSubmit={handleCreateOrUpdate} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <PostForm post={editingPost} onSubmit={handleCreateOrUpdate} />
    </div>
  );
};

export default DashboardPage;
