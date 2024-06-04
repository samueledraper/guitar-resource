export default function Search({ setSearch, search, results, selectTrack }) {
  return (
    <>
      <section>
        <form>
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="Search for a song"
            autoFocus
          />
        </form>
      </section>
      <section>
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
      </section>
    </>
  );
}
