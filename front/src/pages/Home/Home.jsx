import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Home() {
  const { type } = useParams();
  const [gifs, setGifs] = useState([]);
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [selectedGif, setSelectedGif] = useState(new Set());
  const [storedGif, setStoredGif] = useState([]);

  const _selectedGifs = async (pos = "") => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const request = await axios.get(
        `https://obu-discordbot.onrender.com/allgif?type=${type}`
      );

      console.log(request.data.data);
      setStoredGif(request.data.data);
    } catch (err) {
      console.error("Error fetching gifs:", err);
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  const _handleDispatchGif = async (gif) => {
    try {
      setLoading(true);
      // const gifsToSend = Array.from(selectedGif);
      const request = await axios.post(
        "https://obu-discordbot.onrender.com/selectedGif",
        {
          type,
          gif,
        }
      );
      console.log(request);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  const _getGifs = async (pos = "") => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const request = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=anime+${type}&key=AIzaSyC_Js60FnNpi6rIa3Z6LzUZ81rV2R2kKe4&client_key=900989774044-brd69nitvr4d74rbkls80ksavke83cie.apps.googleusercontent.com&limit=50&pos=${pos}`
      );
      setGifs((prevGifs) => [...prevGifs, ...request.data.results]); // Append new results to the previous ones
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
      _selectedGifs();
    }
  }, [type]);

  const handleNext = () => {
    if (next) {
      _getGifs(next); // Fetch next page of gifs
    }
  };

  const handleSelectGif = async (index, gif) => {
    await _handleDispatchGif(gif);
    setSelected((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(index)) {
        updatedSelected.delete(index);
      } else {
        updatedSelected.add(index);
      }
      return updatedSelected;
    });
    setSelectedGif((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(gif)) {
        updatedSelected.delete(gif);
      } else {
        updatedSelected.add(gif);
      }
      return updatedSelected;
    });
  };

  return (
    <>
      <div className="w-full justify-start flex-wrap flex items-center">
        {gifs?.map((gif, index) => (
          <>
            <div key={index} className="relative w-2/12">
              {console.log()}
              <img
                onClick={() => {
                  handleSelectGif(index, gif?.media_formats?.gif?.url);
                }}
                src={gif?.media_formats?.gif?.url}
                alt={`Gif ${index}`}
                width={220}
                className="object-cover w-full"
                style={{
                  border:
                    selected.has(index) ||
                    storedGif.includes(gif?.media_formats?.gif?.url)
                      ? "3px solid red"
                      : "none",
                }} // Optional: Highlight selected GIF with a border
              />
            </div>
          </>
        ))}
      </div>
      <div className="flex items-center justify-center text-black ">
        <div
          className={`py-2 px-9 ${loading ? "bg-gray-400" : "bg-white"}`}
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Loading..." : "Next"}
        </div>
        {/* <div
          className={`py-2 px-9 ${loading ? "bg-gray-400" : "bg-white"}`}
          onClick={_handleDispatchGif}
          disabled={loading}
        >
          {loading ? "Loading..." : "Done"}
        </div> */}
      </div>
    </>
  );
}

export default Home;
