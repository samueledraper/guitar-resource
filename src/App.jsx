import { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";

import Search from "./components/Search";
import Track from "./components/Track";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(false);
  const [trackAnalysis, setTrackAnalysis] = useState({});
  const [trackInfo, setTrackInfo] = useState({
    track: "",
    artist: "",
    cover: "",
  });

  useEffect(() => {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    })
      .then((res) => res.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch) {
      fetch(
        "https://api.spotify.com/v1/search?q=" +
          debouncedSearch +
          "&type=track&limit=3",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setResults(data.tracks.items));
    }
  }, [debouncedSearch]);

  async function selectTrack(id) {
    await fetch("https://api.spotify.com/v1/tracks/" + id + "?market=GB", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTrackInfo({
          track: data.name,
          artist: data.album.artists[0].name,
          cover: data.album.images[0].url,
        });
      });

    await fetch("https://api.spotify.com/v1/audio-analysis/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTrackAnalysis(data.track);
      });

    setSelected(true);
    setSearch("");
  }

  return (
    <>
      <h1>Guitar Resource</h1>
      <Search
        setSearch={setSearch}
        search={search}
        results={results}
        selectTrack={selectTrack}
      />

      {selected && (
        <Track
          results={results}
          trackAnalysis={trackAnalysis}
          trackInfo={trackInfo}
        />
      )}
    </>
  );
}

export default App;
