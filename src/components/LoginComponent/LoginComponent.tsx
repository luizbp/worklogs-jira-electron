/* eslint-disable react-hooks/exhaustive-deps */
import { IoMdLogIn } from "react-icons/io";
import { IoLogInOutline } from "react-icons/io5";

import "./index.css";
import { useState } from "react";

import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import { useJira } from "../../contexts/JiraContext";

const windowCustom: any = window;
const ipcRenderer = windowCustom?.ipcRenderer;

export const LoginComponent = () => {
  const { sessionJiraData, setSessionJiraData, userLogged, setUserLogged, } = useJira()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!sessionJiraData) {
    return (
      <IoMdLogIn
        onClick={async () => {
          await ipcRenderer.invoke("auth:logon", "");
        }}
        className="button-login"
        title="Login in Jira"
      />
    );
  }

  return (
    <Box className="avatar-logged">
      <Box>
        <Tooltip title="Jira Account">
          <IconButton onClick={handleClick} size="small">
            <Avatar
              sx={{ width: 25, height: 25 }}
              alt={userLogged?.userName}
              src={userLogged?.userPicture}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => {
          Swal.fire({
            title: "Logout",
            text: `Log out of jira account?`,
            showCancelButton: true,
            confirmButtonColor: "#08979c",
            cancelButtonColor: "#ff4d4f",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              setSessionJiraData(null)
              setUserLogged(null)
            }
          });
        }}>
          <ListItemIcon>
            <IoLogInOutline size={25} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};
