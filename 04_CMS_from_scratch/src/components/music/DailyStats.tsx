import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { DailyStats as DailyStatsType } from "../../types/music";

interface DailyStatsProps {
  stats: DailyStatsType;
}

export function DailyStats({ stats }: DailyStatsProps) {
  const topGenres = Object.entries(stats.genres)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topYears = Object.entries(stats.years)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Today's Listening Stats
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Total Songs Played: {stats.totalPlayed}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Liked Songs: {stats.likedSongs.length}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Top Genres
        </Typography>
        <List dense>
          {topGenres.map(([genre, count]) => (
            <ListItem key={genre}>
              <ListItemText primary={genre} secondary={`${count} songs`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Top Years
        </Typography>
        <List dense>
          {topYears.map(([year, count]) => (
            <ListItem key={year}>
              <ListItemText primary={year} secondary={`${count} songs`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
