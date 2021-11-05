import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Box,
} from "@mui/material";
import { FC, useState, ChangeEvent, FormEvent } from "react";
import { Socket } from "socket.io-client";
import { VERIFY_USER } from "../../Events";
import { User } from "./interfaceUser";

type TFormLogin = {
  onLoginSubmit: (user: User) => void;
  socket: Socket | null;
};

interface IName {
  fields: {
    name: string;
  };
  fieldErrors: {
    [key: string]: string;
  };
}

const initName = {
  fields: {
    name: "",
  },
  fieldErrors: Object.assign({}),
};

export const FormLogin: FC<TFormLogin> = ({ onLoginSubmit, socket }) => {
  const [state, setState] = useState<IName>(initName);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      ...state,
      fields: { ...state.fields, [name]: value },
      fieldErrors: validate(name, value),
    });
  };

  const setUser = ({ user, isUser }: { user: User; isUser: boolean }) => {
    if (isUser) {
      setState({
        ...state,
        fieldErrors: { ...state.fieldErrors, name: "Name is taken!" },
      });
    } else {
      onLoginSubmit(user);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFirst()) {
      socket?.emit(VERIFY_USER, state.fields.name, setUser);
    }
  };

  const validate = (name: string, value: string) => {
    const fieldErrors = Object.assign({});

    if (value === "") {
      fieldErrors[name] = "Please not blank input!";
    }

    return fieldErrors;
  };

  const validateFirst = () => {
    if (state.fields.name === "") return true;
    return false;
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Box sx={{ bgcolor: "#cfe8fc", p: 6, borderRadius: 5 }}>
        <form onSubmit={handleSubmit}>
          <FormControl variant="filled">
            <InputLabel sx={{ color: "#1976d2", mt: -1 }} htmlFor="name">
              Choose a name
            </InputLabel>
            <Input
              id="name"
              name="name"
              value={state.fields.name}
              onChange={onChange}
              autoComplete="off"
              sx={{ mt: 3, p: 1 }}
            />
            <span style={{ color: "red" }}>{state.fieldErrors.name}</span>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={
                Object.keys(state.fieldErrors).length > 0 || validateFirst()
              }
            >
              Submit
            </Button>
          </FormControl>
        </form>
      </Box>
    </Grid>
  );
};
