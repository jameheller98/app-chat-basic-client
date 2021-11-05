/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Box, Typography, Hidden } from "@mui/material";
import { FC, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ChatHeading } from "../../components/ChatHeading";
import { MessageInput } from "../../components/MessageInput";
import { MessageList } from "../../components/MessageList";
import { SideBar } from "../../components/SideBar";
import {
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  NEW_CHAT_USER,
  PRIVATE_MESSAGE,
  TYPING,
  USER_CONNECTED,
  USER_DISCONNECTED,
} from "../../Events";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { User } from "../User/interfaceUser";
import { selectUser } from "../User/userSlice";
import {
  addListUsers,
  addMessage,
  selectActiveThread,
  selectThreads,
  selectUsers,
  setActiveThread,
  setThreadList,
  updateTyping,
} from "./chatSlice";
import { Message, Thread } from "./interfaceChat";

type TChatContainer = {
  socket: Socket | null;
  onLogout: () => void;
};

export const ChatContainer: FC<TChatContainer> = ({ socket, onLogout }) => {
  const _user = useAppSelector(selectUser);
  const activeThread = useAppSelector(selectActiveThread);
  const _users = useAppSelector(selectUsers);
  const threads = useAppSelector(selectThreads);
  const dispatch = useAppDispatch();

  useEffect(() => {
    initSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      socket?.off(USER_CONNECTED);
    };
  }, []);

  useEffect(() => {
    socket?.off(PRIVATE_MESSAGE).on(PRIVATE_MESSAGE, addThread);
    socket?.off(NEW_CHAT_USER).on(NEW_CHAT_USER, addUserToChat);
    socket?.off(USER_DISCONNECTED).on(USER_DISCONNECTED, (users) => {
      const arrayUser = Object.keys(users).map((key) => users[key]);
      const removedUsers = _users.filter(
        (user: User) => !arrayUser.some((u) => u.id === user.id)
      );
      removedUsersFromChat(removedUsers);
      dispatch(addListUsers(arrayUser));
    });
  }, [threads, _users]);

  const initSocket = () => {
    socket?.emit(COMMUNITY_CHAT, resetChat);
    socket?.on("connect", () => {
      socket?.emit(COMMUNITY_CHAT, resetChat);
    });
    socket?.on(USER_CONNECTED, (users) => {
      const arrayUser = Object.keys(users).map((key) => users[key]);
      dispatch(addListUsers(arrayUser));
    });
  };

  const sendOpenPrivateMessage = (reciever: string) => {
    socket?.emit(PRIVATE_MESSAGE, {
      reciever,
      sender: _user?.name,
      activeThread,
    });
  };

  const addUserToChat = ({
    threadId,
    newUser,
  }: {
    threadId: string;
    newUser: string;
  }) => {
    const newThreads = threads.map((thread) => {
      if (thread.id === threadId) {
        return Object.assign({}, thread, { users: [...thread.users, newUser] });
      }
      return thread;
    });
    dispatch(setThreadList(newThreads));
  };

  const removedUsersFromChat = (removedUsers: User[]) => {
    const newThreads = threads.map((thread) => {
      let newUsers = thread.users.filter(
        (user) => !removedUsers.some((rmu) => rmu.name === user)
      );
      return Object.assign({}, thread, { users: newUsers });
    });
    dispatch(setThreadList(newThreads));
  };

  const resetChat = (thread: Thread) => {
    return addThread(thread, "community", true);
  };

  const addThread = (thread: Thread, sender = "", reset = false) => {
    const newThreads = reset ? [thread] : [...threads, thread];
    dispatch(setThreadList(newThreads));

    if (sender === _user?.name || sender === "community")
      dispatch(setActiveThread(thread));

    const messageEvent = `${MESSAGE_RECIEVED}-${thread.id}`;
    const typingEvent = `${TYPING}-${thread.id}`;

    socket?.off(typingEvent).on(typingEvent, updateTypingInThread(thread.id));
    socket?.off(messageEvent).on(messageEvent, addMessageToThread(thread.id));
  };

  const addMessageToThread = (threadId: string) => {
    return (message: Message) => {
      dispatch(addMessage({ threadId, message }));
    };
  };

  const updateTypingInThread = (threadId: string) => {
    return ({ isTyping, user }: { isTyping: boolean; user: string }) => {
      if (user !== _user?.name) {
        dispatch(updateTyping({ threadId, isTyping, user }));
      }
    };
  };

  const sendMessage = (text: string) => {
    socket?.emit(MESSAGE_SENT, { threadId: activeThread?.id, text });
  };

  const sendTyping = (isTyping: boolean) => {
    socket?.emit(TYPING, { threadId: activeThread?.id, isTyping });
  };

  return (
    <Grid container spacing={0}>
      <Grid item sm={8} xs={12}>
        {activeThread !== null ? (
          <Box sx={{ width: "100%", color: "#006bc6" }}>
            <ChatHeading />
            <MessageList />
            <MessageInput sendMessage={sendMessage} sendTyping={sendTyping} />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" sx={{ color: "#0076da" }}>
              Choose a chat
            </Typography>
          </Box>
        )}
      </Grid>
      <Hidden smDown>
        <Grid item xs={4}>
          <SideBar
            onLogout={onLogout}
            onSendPrivateMessage={sendOpenPrivateMessage}
          />
        </Grid>
      </Hidden>
    </Grid>
  );
};
