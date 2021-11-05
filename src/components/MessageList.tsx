import { Avatar, Box } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import {
  selectMessageList,
  selectTypingUsers,
} from "../features/Chat/chatSlice";
import { selectUser } from "../features/User/userSlice";
import { useAppSelector } from "../hooks";

export const MessageList: FC = () => {
  const refMessageList = useRef<HTMLDivElement | null>(null);
  const messageList = useAppSelector(selectMessageList);
  const user = useAppSelector(selectUser);
  const typingUser = useAppSelector(selectTypingUsers);

  useEffect(() => {
    scrollDown();
  });

  const scrollDown = () => {
    const { current } = refMessageList;
    if (current) {
      current.scrollTop = current.scrollHeight;
    }
  };

  return (
    <>
      <Box sx={{ height: "570px", bgcolor: "#d9e8f5" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "end",
            height: "100%",
          }}
        >
          <Box sx={{ overflow: "auto" }} ref={refMessageList}>
            {messageList.map((message, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection:
                      user?.name === message.sender ? "row-reverse" : "row",
                  }}
                  mx={2}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        user?.name === message.sender ? "orange" : "purple",
                    }}
                  >
                    {message.sender[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ display: "none" }}>{message.timestamp}</Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor:
                        user?.name === message.sender ? "#90c2ed" : "snow",
                      color: user?.name === message.sender ? "snow" : "#90c2ed",
                      borderRadius: "8px",
                    }}
                    p={1}
                    m={1}
                  >
                    <Box
                      sx={{
                        fontSize: "1.5em",
                      }}
                    >
                      {message.text}
                    </Box>
                    <Box sx={{ display: "none" }}>{message.sender}</Box>
                  </Box>
                </Box>
              );
            })}
            {typingUser.map((name) => {
              return (
                <Box
                  key={name}
                  sx={{
                    textAlign: "right",
                    fontSize: "1.25em",
                    padding: "10px",
                  }}
                >{`${name} is typing . . .`}</Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
};
