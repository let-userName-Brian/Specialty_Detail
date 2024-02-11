import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styled from "@emotion/styled";
import logo from "../../assets/images/logo.svg";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import ForumIcon from "@mui/icons-material/Forum";
import Dashboard from "./admin-views/dashboard";
import Services from "./admin-views/services";
import Messages from "./admin-views/messages";
import LogoutIcon from "@mui/icons-material/Logout";
import ReviewsIcon from "@mui/icons-material/Reviews";
import InfoIcon from "@mui/icons-material/Info";
import { Service } from "../../App";
import Testimonies from "./admin-views/testimonies";
import AboutAdmin from "./admin-views/about-admin";

const DrawerWidth = 240;
const MainContent = styled("main")<{ open: boolean }>(({ open }) => ({
  flexGrow: 1,
  padding: "2rem",
  overflowX: "hidden",
  transition: "margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
  marginLeft: open ? `${DrawerWidth}px` : 0,
}));

const options = [
  { icon: <AnalyticsIcon />, text: "Dashboard" },
  { icon: <LocalCarWashIcon />, text: "Prices / Services" },
  { icon: <ReviewsIcon />, text: "Testimonies" },
  { icon: <InfoIcon />, text: "About" },
  { icon: <ForumIcon />, text: "Messages" },
];

export default function AdminMain({
  currentServices,
}: {
  currentServices: Service[];
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [selectedOption, setSelectedOption] = useState(0);

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setDrawerOpen(!drawerOpen);
    }
  };

  const handleListItemClick = (index: number) => {
    setSelectedOption(index);
    handleDrawerToggle();
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 0:
        return <Dashboard />;
      case 1:
        return <Services currentServices={currentServices} />;
      case 2:
        return <Testimonies />;
      case 3:
        return <AboutAdmin />;
      case 4:
        return <Messages />;
      default:
        return <Dashboard />;
    }
  };

  const drawer = (
    <StyledDrawer
      variant={isMobile ? "temporary" : "persistent"}
      open={drawerOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <StyledLogoBox></StyledLogoBox>
      <List>
        {options.map((option, index: number) => (
          <StyledListItem
            onClick={() => handleListItemClick(index)}
            key={index}
            selected={selectedOption === index}
          >
            <StyledListItemIcon>{option.icon}</StyledListItemIcon>
            <StyledListItemText primary={option.text} />
          </StyledListItem>
        ))}
      </List>
      <StyledLogoutBox>
        <StyledListItem>
          <StyledListItemIcon>
            <LogoutIcon />
          </StyledListItemIcon>
          <StyledListItemText primary="Logout" />
        </StyledListItem>
      </StyledLogoutBox>
    </StyledDrawer>
  );

  return (
    <Box>
      {isMobile && (
        <StyledAppBar position="fixed">
          {!drawerOpen && (
            <Toolbar>
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>
          )}
        </StyledAppBar>
      )}
      {drawer}
      <StyledMainContent open={drawerOpen}>
        <Toolbar />
        {(!isMobile || !drawerOpen) && renderContent()}
      </StyledMainContent>
    </Box>
  );
}

const StyledAppBar = styled(AppBar)({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  boxShadow: "none",
});

const StyledMainContent = styled(MainContent)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const StyledDrawer = styled(Drawer)({
  ".MuiDrawer-paper": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: "2rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
});

const StyledLogoBox = styled(Box)({
  height: "20%",
  width: "85%",
  margin: "0 auto",
  borderRadius: "95%",
  marginTop: "1rem",
  backgroundImage: `url(${logo})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

const StyledListItem = styled(ListItem)({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const StyledListItemText = styled(ListItemText)({
  color: "white",
  "& .MuiTypography-root": {
    fontWeight: "bold",
    fontSize: "1rem",
  },
});

const StyledListItemIcon = styled(ListItemIcon)({
  color: "white",
});

const StyledLogoutBox = styled(Box)({
  marginTop: "auto",
});
