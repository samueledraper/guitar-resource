import { useState, useEffect } from "react";

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

  const keySigs = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const mode = ["minor", "major"];

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

  useEffect(() => {
    if (search) {
      fetch(
        "https://api.spotify.com/v1/search?q=" + search + "&type=track&limit=3",
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
  }, [search]);

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
      <form>
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search for a song"
          autoFocus
        />
      </form>

      {search && (
        <div>
          {results.map((track) => {
            return (
              <div onClick={() => selectTrack(track.id)} key={track.id}>
                <img width={100} src={track.album.images[0].url}></img>
                <p>{track.name}</p>
                <p>{track.artists[0].name}</p>

                <p></p>
              </div>
            );
          })}
        </div>
      )}
      {selected && (
        <div>
          <a
            href={`https://www.ultimate-guitar.com/search.php?title=${trackInfo.track}&page=1&type=200`}
            target="_blank"
          >
            Search Ultimate Guitar for tabs
          </a>
          <p>key: {keySigs[trackAnalysis.key]}</p>
          <p>mode: {mode[trackAnalysis.mode]}</p>
          <p>time signature: {trackAnalysis.time_signature}/4</p>
          <p>tempo: {Math.round(trackAnalysis.tempo)}BPM</p>
          <p>{trackInfo.artist}</p>
          <p>{trackInfo.track}</p>
          <img src={trackInfo.cover} />
        </div>
      )}
    </>
  );
}

export default App;
