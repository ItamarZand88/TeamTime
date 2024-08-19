import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import {
  Button,
  Paper,
  Typography,
  Box,
  TextField,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import LogoTeamTime from "../ui-component/LogoTeamTime";
import AnimatedLogoTeamTime from "../ui-component/AnimatedLogoTeamTime";
import { styled } from "@mui/material/styles";
import bgImage from "../assets/images/image@2x.png";
import "./styles/Background.css";
import "./styles/BubbleText.css";

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  width: "90%",
  maxWidth: "600px",
  margin: "auto",
}));

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // State for modal

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const BubbleText = ({ text }) => {
    return (
      <h2 className="heading-2">
        {text.split(" ").map((word, wordIdx) => (
          <span className="hoverText" key={wordIdx}>
            {word.split("").map((char, charIdx) => (
              <span className="hoverLetter" key={`${wordIdx}-${charIdx}`}>
                {char}
              </span>
            ))}
          </span>
        ))}
      </h2>
    );
  };
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await login(username, password);
      setLoading(false);

      // Redirect based on the user type
      navigate(user.userType === "admin" ? "/admin" : "/employee");
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: open ? "blur(8px)" : "none", // Apply blur when modal is open
        pointerEvents: open ? "none" : "auto", // Disable interaction with background when modal is open
      }}
    >
      <div className="background">
        <div className="logo-title-wrapper">
          <AnimatedLogoTeamTime size={4} outlined={false} />
          <a className="teamtime">TeamTime</a>
        </div>
        <section className="background-inner">
          <div className="heading-2-parent">
            <BubbleText text="Set up your team's shift schedule." />
            <BubbleText text="In one click." />
            <div className="button-container-wrapper">
              <button
                className="button-container button-focus-in"
                onClick={handleOpen}
              >
                <div className="sign-in">Sign In</div>
              </button>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 50 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={open}>
          <CustomPaper elevation={6}>
            {/* <Typography variant="h4" align="center" mb={2} color="primary">
              Sign In
            </Typography> */}
            {/* <Logo /> */}
            <LogoTeamTime size={6} />
            <Typography variant="h2" sx={{ ml: 1, color: "text.primary" }}>
              TeamTime
            </Typography>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mt: 2, mb: 1 }}
              onKeyDown={handleKeyDown}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              onKeyDown={handleKeyDown}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleLogin}
              fullWidth
              sx={{
                mb: 2,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
                color: "#fff",
              }}
            >
              Sign In
            </Button>
          </CustomPaper>
        </Fade>
      </Modal>
    </Box>
  );
};

export default LoginPage;
