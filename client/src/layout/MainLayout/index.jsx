import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  useMediaQuery,
} from "@mui/material";

// project imports
import Breadcrumbs from "../../ui-component/extended/Breadcrumbs";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";

// import Customization from '../Customization';
import navigation from "../../menu-items";
import { drawerWidth } from "../../store/constant";
import { SET_MENU } from "../../store/actions";

// assets
import { IconChevronRight } from "@tabler/icons-react";

import { useSpring, animated } from "react-spring";

// styles
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

// ==============================|| MAIN LAYOUT ||============================== //
const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth(); // Ensure you are extracting user from context
  const leftDrawerOpened = useSelector((state) => state.customization.opened); // Make sure this line is active
  const dispatch = useDispatch();

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  useEffect(() => {}, [user, leftDrawerOpened]); // Removed location from dependencies as it's not defined; consider using useLocation if needed

  return (
    <animated.div style={fade}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* header */}
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

            {/*this button ^^ will be removed just for now. */}
          </Toolbar>
        </AppBar>

        {/* drawer */}
        <Sidebar
          drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
          drawerToggle={handleLeftDrawerToggle}
        />

        {/* main content */}
        <Main
          theme={theme}
          open={leftDrawerOpened}
          style={{
            // White background
            backgroundImage: "radial-gradient(#91969C 0.1px, transparent 1px)", // Dots
            backgroundSize: "20.35px 20.35px", // Adjust dot spacing as needed
            backgroundRepeat: "repeat", // Ensure the background repeats across the component
          }}
        >
          {/* breadcrumb */}
          <Breadcrumbs
            separator={IconChevronRight}
            navigation={navigation}
            icon
            title
            rightAlign
          />
          <Outlet />
        </Main>
        {/* <Customization /> */}
      </Box>
    </animated.div>
  );
};

export default MainLayout;
