import { Send } from "@mui/icons-material";
import { Box, Button, Input } from "@mui/material";
import {
  ChangeEvent,
  FC,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";

type TMessageInput = {
  sendMessage: (text: string) => void;
  sendTyping: (isTyping: boolean) => void;
};

interface IData {
  fields: {
    text: string;
  };
  isTyping: boolean;
}

const initData = {
  fields: {
    text: "",
  },
  isTyping: false,
};

const variablesObject = {
  lastUpdateTime: 0,
  typingInterval: setInterval(() => {}, 0),
};

export const MessageInput: FC<TMessageInput> = ({
  sendMessage,
  sendTyping,
}) => {
  const [state, setState] = useState<IData>(initData);

  useEffect(() => {
    return () => {
      stopCheckingTyping();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      ...state,
      fields: { ...state.fields, [name]: value },
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(state.fields.text);
    setState(initData);
  };
  const handleSendTyping = () => {
    variablesObject.lastUpdateTime = Date.now();
    if (!state.isTyping) {
      setState((state) => ({ ...state, isTyping: true }));
      sendTyping(true);
      startCheckingTyping();
    }
  };

  const startCheckingTyping = () => {
    variablesObject.typingInterval = setInterval(() => {
      if (Date.now() - variablesObject.lastUpdateTime > 300) {
        setState((state) => ({ ...state, isTyping: false }));
        stopCheckingTyping();
      }
    }, 300);
  };

  const stopCheckingTyping = () => {
    if (variablesObject.typingInterval) {
      clearInterval(variablesObject.typingInterval);
      sendTyping(false);
    }
  };

  return (
    <>
      <Box my={1}>
        <form onSubmit={handleSubmit}>
          <Input
            id="text"
            name="text"
            type="text"
            value={state.fields.text}
            autoComplete="off"
            placeholder="Type anything"
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
              e.keyCode !== 13 && handleSendTyping();
            }}
            onChange={onChange}
            disableUnderline={true}
            sx={{
              bgcolor: "#94b7d4",
              padding: "10px 15px",
              color: "snow",
              width: "85%",
              borderRadius: "10px",
              fontSize: "1.25rem",
            }}
          ></Input>
          <Box sx={{ display: "inline-block", width: "15%" }}>
            <Button
              type="submit"
              sx={{ margin: "5px" }}
              disabled={state.fields.text.length <= 0}
            >
              <Send sx={{ fontSize: "2rem" }} />
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};
