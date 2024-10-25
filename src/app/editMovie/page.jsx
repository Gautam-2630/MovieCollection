"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UploadIcon } from "@heroicons/react/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import base_url from "../../constants";
import { Suspense } from "react";


export default function Component() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [base64Image, setBase64Image] = useState(''); // For storing the base64 string
  

  const id = searchParams.get("id");
//  const title = searchParams.get("title");
//  const publishingYear = searchParams.get("publishingYear");

const getMovie = async ()=>{
  try {
    const token = localStorage.getItem("authToken");



    // Set up headers for JSON data
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`${base_url}/api/movie/${id}`,config);
    console.log(res)
    setTitle(res.data.data.title);
    setPublishingYear(res.data.data.publishingYear);
    setImagePreview(res.data.data.posterURL);
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=>{
 getMovie();
},[])


  const [title,setTitle] = useState();
  const [publishingYear,setPublishingYear] = useState();

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");

      // Prepare data with base64 image
      const payload = {
        title: title,
        publishingYear: publishingYear,
        posterURL: imagePreview, // Attach base64 image string
      };

      // Set up headers for the request
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Make the POST request to update the movie
      const res = await axios.post(
        `${base_url}/api/movie/?movieId=${id}`,
        payload,
        config
      );

      toast.success("Movie updated successfully");
      router.push("/movieCollection"); // Navigate to movie collection after success
    } catch (error) {
      toast.error("Movie not updated");
      console.error("Error:", error);
      router.push("/movieCollection");
    }
  };

  // Handle image change and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setBase64Image(base64String); // Store the base64 string
        setImagePreview(base64String); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    
    <div className="min-h-screen bg-[#093545] text-white p-[120px] relative overflow-hidden">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8">Edit Movie</h1>

      <form
        onSubmit={onSubmit}
        className="flex flex-col md:flex-row gap-[127px]"
      >
        {/* Image upload section */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="image"
            className="w-full h-[500px] border-2 border-dashed border-white rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-[#224957]"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <UploadIcon className="w-12 h-12 mx-auto mb-2" />
                <span>Drop an image here</span>
              </div>
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
            
              onInput={handleImageChange}
            
            />
          </label>

        </div>

        {/* Form fields section */}
        <div className="w-full md:w-96">
          <div>
            <input
              type="text"
              placeholder="Title"
              onChange={(e)=>{setTitle(e.target.value)}}
              value={title}
              className=" mb-6 w-full px-4 py-[10px] bg-[#224957] text-white placeholder-white border rounded-md focus:outline-none border-[#224957]"
            />

          </div>

          <div>
            <input
              type="number"
              placeholder="Publishing year"
              onChange={(e)=>{setPublishingYear(e.target.value)}}
              value={publishingYear}
              className="w-full px-4 py-[10px] border-[#224957] bg-[#224957] text-white placeholder-white border rounded-md"
            />

          </div>

          {/* Submit button */}
          <div className="flex space-x-4 mt-[64px]">
            <button
              type="button"
              className="px-14 py-[15px] border border-white text-white rounded-md hover:bg-teal-800 transition duration-200"
              onClick={() => router.push("/movieCollection")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-14 py-[15px] bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
