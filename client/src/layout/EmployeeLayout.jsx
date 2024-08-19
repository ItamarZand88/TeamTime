import React from "react";
import { Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import Header from "./MainLayout/Header/index";
import Sidebar from "../components/employeesComponents/ui-components/SideBar/SideBar";
import { useSelector, useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import { SET_MENU } from "../store/actions";

const drawerWidth = 240;

// Styled main component with dynamic styling based on the sidebar state
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "theme",
})(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    "margin",
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }
  ),
  [theme.breakpoints.up("md")]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`,
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: "20px",
    width: `calc(100% - ${drawerWidth}px)`,
    padding: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    marginLeft: "10px",
    width: `calc(100% - ${drawerWidth}px)`,
    padding: "16px",
    marginRight: "10px",
  },
}));

const EmployeeLayout = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  return (
    <animated.div style={fade}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.default,
            transition: leftDrawerOpened
              ? theme.transitions.create("width")
              : "none",
          }}
        >
          <Toolbar>
            <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
          </Toolbar>
        </AppBar>
        <Sidebar
          drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
          drawerToggle={handleLeftDrawerToggle}
        />
        <Main
          open={leftDrawerOpened}
          theme={theme}
          style={{
            // White background
            backgroundImage: "radial-gradient(#91969C 0.1px, transparent 1px)", // Dots
            backgroundSize: "20.35px 20.35px", // Adjust dot spacing as needed
            backgroundRepeat: "repeat", // Ensure the background repeats across the component
          }}
        >
          <Outlet />
        </Main>
      </Box>
    </animated.div>
    // <div>
    //   <header>
    //     <h1>Employee Portal</h1>
    //     {/* Navigation could go here */}
    //   </header>
    //   <main>
    //     <Outlet /> {/* This is where nested routes will render */}
    //   </main>
    // </div>
  );
};

export default EmployeeLayout;
