import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { selectActiveThread } from "../features/Chat/chatSlice";
import { useAppSelector } from "../hooks";

export const ChatHeading: FC = () => {
  const activeThread = useAppSelector(selectActiveThread);
  return (
    <>
      <Box p={2} sx={{ bgcolor: "#c6e1f7", textAlign: "right" }}>
        <Typography variant="h4">{activeThread?.title}</Typography>
      </Box>
    </>
  );
};
