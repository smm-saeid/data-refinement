import {  Input, TextareaAutosize, TextField } from '@mui/material';


const DisabledTextInput = ({label, value, multiline=false, grey=false}) => {

  if (!multiline){
    return (
      <TextField
        label={label}
        type="text"
        value={value}
        disabled={true}
        fullWidth
        sx={grey ? {} : {
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
          },
          "& .MuiInputLabel-root.Mui-disabled": {
            WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
          },
        }}
      />
    )
  }else{
    return (
      <TextField
        label={label}
        type="text"
        value={value}
        disabled={true}
        fullWidth
        multiline
        rows={6}
        sx={grey ? {} : {
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
          },
          "& .MuiInputLabel-root.Mui-disabled": {
            WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
          },
          "& textarea": {
            overflowY: "scroll !important",
          }
        }}
      />
    )
  }
}

export default DisabledTextInput;