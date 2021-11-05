import { Container } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { FormLogin } from "./features/User/FormLogin";
import { loginUser, logoutUser, selectUser } from "./features/User/userSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { io, Socket } from "socket.io-client";
import { LOGOUT, USER_CONNECTED, VERIFY_USER } from "./Events";
import { User } from "./features/User/interfaceUser";
import { ChatContainer } from "./features/Chat/ChatContainer";

//Local host
const socketUrl = "http://localhost:8080";
//Ip host
// const socketUrl = "http://192.168.1.4:8080";
const App: FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    initSocket();
  }, []);

  const initSocket = () => {
    const socket = io(socketUrl);

    socket.on("connect", () => {
      if (user) {
        reconnect(socket);
      } else {
        console.log("Connected");
      }
    });

    setSocket(socket);
  };

  const reconnect = (socket: Socket) => {
    socket?.emit(
      VERIFY_USER,
      user?.name,
      ({ isUser, user }: { isUser: boolean; user: User }) => {
        if (isUser) {
          dispatch(logoutUser());
        } else {
          dispatch(loginUser(user));
        }
      }
    );
  };

  const onLogin = (user: User) => {
    socket?.emit(USER_CONNECTED, user);
    dispatch(loginUser(user));
  };

  const onLogout = () => {
    socket?.emit(LOGOUT);
    dispatch(logoutUser());
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: "#e7f3fd" }}>
      {!user ? (
        <FormLogin socket={socket} onLoginSubmit={onLogin} />
      ) : (
        <ChatContainer socket={socket} onLogout={onLogout} />
      )}
    </Container>
  );
};

export default App;
