import { Box, Button, TextField, Typography, styled } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { loggedInUserSetter } from "./cache/logged-in";

export default function Login() {
  const router = useNavigate();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        loggedInUserSetter(userCredential.user);
        setError("");
        router("/admin");
      })
      .catch((error) => {
        setError(error.code);
      });
  };

  return (
    <StyledLoginWrapper>
      <StyledLoginCard>
        <StyledTitleBox>
          <StyledTitle>Login</StyledTitle>
        </StyledTitleBox>
        <StyledLoginFormBox>
          <StyledTextField
            variant="standard"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <StyledTextField
            variant="standard"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </StyledButton>
          {error && (
            <Typography color="error">
              {error === "auth/user-not-found"
                ? "User not found"
                : error === "auth/wrong-password"
                ? "Wrong password"
                : "An error occurred"}
            </Typography>
          )}
        </StyledLoginFormBox>
      </StyledLoginCard>
    </StyledLoginWrapper>
  );
}

const StyledLoginWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
});

const StyledLoginCard = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "30%",
  height: "auto",
  borderRadius: "3rem",
  gap: "2rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  padding: "2rem",
  boxSizing: "border-box",
  overflow: "auto",
  "@media (max-width: 600px)": {
    padding: "1rem",
    width: "90%",
    height: "auto",
    paddingBottom: "2rem",
  },
});

const StyledTitleBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "auto",
  "@media (max-width: 600px)": {
    paddingTop: "1rem",
  },
});

const StyledTitle = styled(Typography)({
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "2rem",
  fontWeight: "bold",
  "@media (max-width: 600px)": {
    fontSize: "1.5rem",
  },
});

const StyledLoginFormBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "auto",
  paddingBottom: "2rem",
  paddingTop: "2rem",
  gap: "4rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "2rem",
  "@media (max-width: 600px)": {
    padding: "2rem",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  },
});

const StyledTextField = styled(TextField)({
  width: "80%",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInput-root": {
    "& input": {
      color: "white",
    },
    "& textarea": {
      color: "white",
    },
    "& select": {
      color: "white",
    },
    "&:before": {
      borderBottomColor: "white",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "white",
    },
    "&.Mui-focused:after": {
      borderBottomColor: "white",
    },
  },
  "& .MuiSelect-icon": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "@media (max-width: 600px)": {
    width: "90%",
  },
});

const StyledButton = styled(Button)({
  width: "50%",
  height: "auto",
  borderRadius: "2rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(160,32,240)",
  },
  "@media (max-width: 600px)": {
    fontSize: "1rem",
  },
});
