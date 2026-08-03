import { Button, type SxProps, type Theme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import AddCircleIcon from "@mui/icons-material/AddCircle";


export default function CreateNewItem({
icon,
name,
url,
sx
}:{
  icon: React.ReactElement;
  name: string;
  url?: string;
  sx?: SxProps<Theme>;
  
}){
  const navigate = useNavigate();
  const internalSx = { minWidth: "50px", mb: 2 };
  return (
        <Button
      variant="contained"
      endIcon={icon || <AddCircleIcon />}
      onClick={() => navigate(url || "new")}
      color="success"
      sx={{ ...internalSx, ...sx  }}
    >
      ایجاد {name} جدید
    </Button>
  );}