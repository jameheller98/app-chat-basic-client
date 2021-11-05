import {
  Eject as EjectIcon,
  Add as AddIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  Menu,
  Input,
  Typography,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import {
  ChangeEvent,
  FC,
  FormEvent,
  MouseEvent,
  useRef,
  useState,
} from "react";
import {
  resetActiveThread,
  selectActiveThread,
  selectThreads,
  setActiveThread,
  selectUsers,
} from "../features/Chat/chatSlice";
import { Thread } from "../features/Chat/interfaceChat";
import { selectUser } from "../features/User/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { SideBarOption } from "./SideBarOption";
import { createChatNameFromUser } from "../Factories";

type TSideBar = {
  onLogout: () => void;
  onSendPrivateMessage: (reciever: string) => void;
};

const type = {
  CHATS: "chats",
  USERS: "users",
};

export const SideBar: FC<TSideBar> = ({ onLogout, onSendPrivateMessage }) => {
  const [reciever, setReceiver] = useState<string>("");
  const [activeSideBar, setActiveSideBar] = useState<string>(type.CHATS);
  const userRef = useRef<HTMLDivElement>(null);
  const threads = useAppSelector(selectThreads);
  const activeThread = useAppSelector(selectActiveThread);
  const userLogin = useAppSelector(selectUser);
  const users = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  const resetActiveChat = (e: MouseEvent<HTMLDivElement>) => {
    e.target === userRef.current && dispatch(resetActiveThread());
  };

  const setActiveChat = (thread: Thread) => {
    dispatch(setActiveThread(thread));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hasRecieverAndSender = threads.findIndex(
      (thread) =>
        thread.users.includes(reciever) &&
        thread.users.includes(userLogin?.name || "") &&
        thread.users.length < 3
    );
    hasRecieverAndSender < 0
      ? onSendPrivateMessage(reciever)
      : dispatch(setActiveThread(threads[hasRecieverAndSender]));
    setReceiver("");
  };

  const addChatForUser = (username: string) => {
    const hasRecieverAndSender = threads.findIndex(
      (thread) =>
        thread.users.includes(username) &&
        thread.users.includes(userLogin?.name || "") &&
        thread.users.length < 3
    );
    hasRecieverAndSender < 0
      ? onSendPrivateMessage(username)
      : dispatch(setActiveThread(threads[hasRecieverAndSender]));
    setActiveSideBar(type.CHATS);
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#d2e0e9",
          color: "snow",
          height: "721px",
          textAlign: "right",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#94b7d4",
          }}
          px={1}
          py={2}
        >
          <Menu open={false}></Menu>
          <MenuIcon />
          <Typography variant="h5">
            <KeyboardArrowDownIcon sx={{ verticalAlign: "sub" }} />
            App chat
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "#315776" }} />
        <Box
          p={1}
          sx={{
            bgcolor: "#afcae1",
          }}
        >
          <Grid sx={{ alignItems: "center" }} container spacing={1}>
            <Grid item xs={1}>
              <AddIcon />
            </Grid>
            <Grid item xs={10}>
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="Search"
                  size="medium"
                  sx={{ color: "snow", width: "100%", padding: "4px" }}
                  disableUnderline={true}
                  value={reciever}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setReceiver(e.target.value);
                  }}
                />
              </form>
            </Grid>
            <Grid item xs={1}>
              <SearchIcon />
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ borderColor: "#315776" }} />
        <Box>
          <Box
            sx={{
              width: "50%",
              display: "inline-block",
              bgcolor: activeSideBar === type.CHATS ? "#94b7d4" : "transparent",
            }}
            onClick={() => {
              setActiveSideBar(type.CHATS);
            }}
          >
            <Stack sx={{ textAlign: "center" }}>Chats</Stack>
          </Box>
          <Box
            sx={{
              width: "50%",
              display: "inline-block",
              bgcolor: activeSideBar === type.USERS ? "#94b7d4" : "transparent",
            }}
            onClick={() => {
              setActiveSideBar(type.USERS);
            }}
          >
            <Stack sx={{ textAlign: "center" }}>Users</Stack>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#315776" }} />
        <Box
          ref={userRef}
          onClick={resetActiveChat}
          sx={{
            height: "525px",
            bgcolor: "#afcae1",
          }}
          ml={1}
        >
          {activeSideBar === type.CHATS
            ? threads.map((thread) => {
                if (thread.title) {
                  return (
                    <SideBarOption
                      key={thread.id}
                      name={
                        thread.isCommunity
                          ? thread.title
                          : createChatNameFromUser(
                              thread.users,
                              userLogin?.name
                            )
                      }
                      lastMessage={thread.messages[thread.messages.length - 1]}
                      active={activeThread?.id === thread.id}
                      onClick={() => {
                        setActiveChat(thread);
                      }}
                    />
                  );
                }
                return null;
              })
            : users
                .filter((u) => u.name !== userLogin?.name)
                .map((ortherUser) => {
                  return (
                    <SideBarOption
                      key={ortherUser.id}
                      name={ortherUser.name}
                      onClick={() => {
                        addChatForUser(ortherUser.name);
                      }}
                    />
                  );
                })}
        </Box>
        <Divider sx={{ borderColor: "#315776" }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#afcae1",
          }}
          p={1}
        >
          <EjectIcon onClick={() => onLogout()} sx={{ cursor: "pointer" }} />
          <Typography variant="h5">{userLogin?.name}</Typography>
        </Box>
      </Box>
    </>
  );
};
