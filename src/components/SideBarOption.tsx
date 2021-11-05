import { Avatar, Box, Typography } from "@mui/material";
import { FC } from "react";
import { Message } from "../features/Chat/interfaceChat";
import { truncateWord } from "../helper/helper";

type TSideBarOption = {
  name: string;
  lastMessage?: Message;
  active?: boolean;
  onClick: () => void;
};

export const SideBarOption: FC<TSideBarOption> = ({
  name,
  lastMessage,
  active,
  onClick,
}) => {
  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: active ? "#90c2ed" : "transparent",
        }}
        p={1}
      >
        <Avatar>{name[0].toUpperCase()}</Avatar>
        <Box pl={2} sx={{ width: "80%", textAlign: "left" }}>
          <Typography variant="h5">{name}</Typography>
          {lastMessage && (
            <Box
              className="last-message"
              sx={{
                color: "#f4f4f4",
                fontSize: "1.25em",
              }}
            >
              {truncateWord(lastMessage.text, 4)}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
