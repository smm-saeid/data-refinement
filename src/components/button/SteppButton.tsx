import { Button, Fab, type SxProps } from '@mui/material';
import React from "react";

type Props = {
  handleStep: (step: number) => void;
  label: string;
  index: number;
  activeStep: number;
  type?: "contained" | "text"|'outlined'|'fab';
  sx?:  SxProps;
};

const SteppButton: React.FC<Props> = ({ handleStep, label, index, activeStep,type,sx }) => {
  if(type==='fab'){
    return (
      <Fab
        color={index == activeStep ? "primary" : "default"}
        sx={{marginRight:"10px", ...sx}}
        onClick={() => handleStep(index)}
      >
        {label}
      </Fab>
    );
  }
  else if(type)
    return (
      <Button
        variant={type}
        color={index == activeStep ? "primary" : "inherit"}
        sx={{
          mr:1,
          pl: 2,
          pr: 2,
          ...sx
        }}
        onClick={() => handleStep(index)}
      >
        {label}
      </Button>
    );
  else
    return (
      <Button
        sx={{
          color: index == activeStep ? "primary" : "grey",
          borderBottom: index == activeStep ? "solid 2px" : 0,
          borderRadius: 0,
          pl: 2,
          pr: 2,
          ...sx
        }}
        onClick={() => handleStep(index)}
      >
        {label}
      </Button>
    );
};

export default SteppButton;
