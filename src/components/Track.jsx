export default function Track({ trackAnalysis, trackInfo }) {
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

  return (
    <section>
      <a
        href={`https://www.ultimate-guitar.com/search.php?title=${trackInfo.track}&page=1&type=200`}
        target="_blank"
      >
        Search Ultimate Guitar for tabs
      </a>
      <p>key: {keySigs[trackAnalysis.key]}</p>
      <p>mode: {mode[trackAnalysis.mode]}</p>
      <p>tempo: {Math.round(trackAnalysis.tempo)}BPM</p>
      <p>{trackInfo.artist}</p>
      <p>{trackInfo.track}</p>
      <img src={trackInfo.cover} />
    </section>
  );
}
