import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Gif() {
  const { type } = useParams();
  const [gifs, setGifs] = useState([]);
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [selectedGif, setSelectedGif] = useState(new Set());

  const _removeGif = async (gif) => {
    try {
    } catch (err) {}
  };

  const _getGifs = async (pos = "") => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const request = await axios.get(
        `http://localhost:8888/allgif?type=${type}`
      );
      console.log(gifs);
      setGifs((prevGifs) => [...prevGifs, ...request.data.data]); // Append new results to the previous ones
      setNext(request.data.next); // Update next page token
    } catch (err) {
      console.error("Error fetching gifs:", err);
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  useEffect(() => {
    if (type) {
      _getGifs(); // Fetch gifs when the component mounts or when `type` changes
    }
  }, [type]);

  return (
    <>
      <div className="w-full justify-start flex-wrap flex items-center">
        {gifs?.map((gif, index) => (
          <div key={index} className="relative w-2/12">
            <img
              onClick={() => {}}
              src={gif}
              alt={`Gif ${index}`}
              width={220}
              className="object-cover w-full"
              style={{
                border: selected.has(index) ? "3px solid red" : "none",
              }} // Optional: Highlight selected GIF with a border
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Gif;
