import React, { useState } from 'react';
import { TextField, Popover, Grid, Button, Box } from '@mui/material';

const KeypadTextField = ({ value, onChange, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [localValue, setLocalValue] = useState(value || '');

  const handleOpenKeypad = event => {
    setAnchorEl(event.currentTarget);
    setLocalValue(value || '');
  };

  const handleCloseKeypad = () => {
    setAnchorEl(null);
  };

  const handleKeyPress = key => {
    setLocalValue(prev => prev + key);
  };

  const handleBackspace = () => {
    setLocalValue(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setLocalValue('');
  };

  const handleConfirm = () => {
    onChange({ target: { value: localValue } });
    handleCloseKeypad();
  };

  const open = Boolean(anchorEl);

  // Persian/Arabic keypad layout
  const keys = [
    ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'],
    ['ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د'],
    ['ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ'],
    ['ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و'],
    ['ه', 'ی', 'آ', '‌', ' ', '،', '.', '?', '!', '؟'],
  ];

  return (
    <>
      <TextField
        {...props}
        value={value}
        onChange={onChange}
        onClick={handleOpenKeypad}
        inputProps={{
          ...props.inputProps,
          readOnly: true,
          style: { cursor: 'pointer' },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseKeypad}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 500 }}>
          <Grid container spacing={0.5}>
            {keys.map((row, rowIndex) => (
              <Grid container item spacing={0.5} key={rowIndex}>
                {row.map(key => (
                  <Grid item key={key}>
                    <Button
                      variant="outlined"
                      onClick={() => handleKeyPress(key)}
                      sx={{ minWidth: 40, height: 40 }}
                    >
                      {key}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ))}
            <Grid container item spacing={0.5} sx={{ mt: 1 }}>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClear}
                  sx={{ minWidth: 80 }}
                >
                  پاک کردن
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleBackspace}
                  sx={{ minWidth: 80 }}
                >
                  ←
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirm}
                  sx={{ minWidth: 80 }}
                >
                  تایید
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            متن فعلی: {localValue}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default KeypadTextField;
