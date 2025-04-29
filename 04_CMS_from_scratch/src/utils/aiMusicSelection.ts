import { Song } from "../types/music";

interface GenreWeights {
  [key: string]: number;
}

interface YearWeights {
  [key: string]: number;
}

export function generateDailyPlaylist(
  allSongs: Song[],
  playedHistory: string[],
  targetSize: number = 50
): Song[] {
  // Initialize weights
  const genreWeights: GenreWeights = {};
  const yearWeights: YearWeights = {};

  // Calculate initial weights based on played history
  allSongs.forEach((song) => {
    const timesPlayed = playedHistory.filter((id) => id === song.id).length;
    genreWeights[song.genre] = (genreWeights[song.genre] || 0) + timesPlayed;
    yearWeights[song.releaseYear.toString()] =
      (yearWeights[song.releaseYear.toString()] || 0) + timesPlayed;
  });

  // Normalize weights (invert so less played = higher weight)
  const maxGenreWeight = Math.max(...Object.values(genreWeights));
  const maxYearWeight = Math.max(...Object.values(yearWeights));

  Object.keys(genreWeights).forEach((genre) => {
    genreWeights[genre] = 1 - genreWeights[genre] / (maxGenreWeight || 1);
  });

  Object.keys(yearWeights).forEach((year) => {
    yearWeights[year] = 1 - yearWeights[year] / (maxYearWeight || 1);
  });

  // Score each song
  const scoredSongs = allSongs.map((song) => {
    const genreScore = genreWeights[song.genre] || 1;
    const yearScore = yearWeights[song.releaseYear.toString()] || 1;
    const popularityScore = song.popularityScore / 100;
    const recencyPenalty = playedHistory.includes(song.id) ? 0.5 : 1;

    return {
      song,
      score:
        genreScore * 0.3 +
        yearScore * 0.3 +
        popularityScore * 0.3 +
        recencyPenalty * 0.1,
    };
  });

  // Sort by score and select top songs
  const selectedSongs = scoredSongs
    .sort((a, b) => b.score - a.score)
    .slice(0, targetSize)
    .map((item) => item.song);

  // Ensure genre diversity
  const genreCounts: Record<string, number> = {};
  selectedSongs.forEach((song) => {
    genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
  });

  // If any genre is overrepresented, replace some songs
  const maxGenreCount = Math.ceil(targetSize / Object.keys(genreCounts).length);
  const finalPlaylist = [...selectedSongs];

  Object.entries(genreCounts).forEach(([genre, count]) => {
    if (count > maxGenreCount) {
      const excess = count - maxGenreCount;
      const songsToReplace = finalPlaylist
        .filter((song) => song.genre === genre)
        .slice(0, excess);

      songsToReplace.forEach((songToReplace) => {
        const replacement = scoredSongs
          .filter(
            (item) =>
              item.song.genre !== genre &&
              !finalPlaylist.includes(item.song) &&
              !playedHistory.includes(item.song.id)
          )
          .sort((a, b) => b.score - a.score)[0]?.song;

        if (replacement) {
          const index = finalPlaylist.indexOf(songToReplace);
          finalPlaylist[index] = replacement;
        }
      });
    }
  });

  return finalPlaylist;
}
