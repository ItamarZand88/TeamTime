import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles"; // Correct import for useTheme

// Material-UI components
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

// Icons
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// Redux actions
import { MENU_OPEN, SET_MENU } from "../../../../../store/actions";

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
  const navigate = useNavigate();
  const theme = useTheme(); // Now correctly imported
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: customization.isOpen.includes(item.id) ? 8 : 6,
        height: customization.isOpen.includes(item.id) ? 8 : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  const isSelected = location.pathname === item.url;

  const handleClick = () => {
    dispatch({ type: MENU_OPEN, id: item.id });
    navigate(item.url); // Using navigate here to perform navigation on click
  };

  return (
    <ListItemButton
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: "flex-start",
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
        "&.Mui-selected, &:hover": {
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.text.primary,
          "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
          },
        },
      }}
      selected={isSelected}
      onClick={handleClick}
    >
      <ListItemIcon sx={{ my: "auto", minWidth: !item.icon ? 18 : 36 }}>
        {itemIcon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" color="inherit">
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
};

export default NavItem;
