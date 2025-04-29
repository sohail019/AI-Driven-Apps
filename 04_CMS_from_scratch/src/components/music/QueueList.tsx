import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { Song } from "../../types/music";

interface QueueListProps {
  queue: Song[];
  currentSongId: string | undefined;
  onSongSelect: (song: Song) => void;
}

export function QueueList({
  queue,
  currentSongId,
  onSongSelect,
}: QueueListProps) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {queue.map((song) => (
        <ListItem
          key={song.id}
          alignItems="flex-start"
          sx={{
            cursor: "pointer",
            bgcolor:
              song.id === currentSongId ? "action.selected" : "transparent",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          onClick={() => onSongSelect(song)}
        >
          <ListItemAvatar>
            <Avatar
              alt={song.title}
              src={song.albumCover || "/default-album.png"}
              variant="rounded"
            />
          </ListItemAvatar>
          <ListItemText
            primary={song.title}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {song.artist}
                </Typography>
                {` — ${song.genre} • ${song.releaseYear}`}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
