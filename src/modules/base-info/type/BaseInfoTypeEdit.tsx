import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';

type BaseInfoTypeEditProps = {
  open: boolean;
  editData: any;
  options: { id: number; title: string }[];
    selectedCommonBaseType: { id: number; title: string } | null;
  setEditData: (v: any) => void;
  onClose: () => void;
  onSave: () => void;
    setSelectedCommonBaseType: (
    val: { id: number; title: string } | null
  ) => void;
};


export function BaseInfoTypeEdit({
  open,
  editData,
  options,
  selectedCommonBaseType,
  setEditData,
  onClose,
  onSave,
  setSelectedCommonBaseType,

}: BaseInfoTypeEditProps) {
  if (!editData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ویرایش </DialogTitle>
      <DialogContent>
        <TextField
          label="عنوان"
          fullWidth
          margin="normal"
          value={editData.title}
          onChange={e => setEditData({ ...editData, title: e.target.value })}
        />
        <TextField
          label="className"
          fullWidth
          margin="normal"
          value={editData.className}
          onChange={e =>
            setEditData({ ...editData, className: e.target.value })
          }
        />

        <Autocomplete
           options={options}
           getOptionLabel={opt => opt.title}
           value={selectedCommonBaseType}
           onChange={(_event, newValue) => {
           if (newValue) {
            setSelectedCommonBaseType(newValue);
                 } else {
                       setSelectedCommonBaseType(null);
                      }
                    }}
           isOptionEqualToValue={(option, value) => option.id === value.id}
           renderInput={params => (
          <TextField {...params} label=" والد " fullWidth />
                    )}
                  />

        <TextField
          label="توضیحات"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={editData.description}
          onChange={e =>
            setEditData({ ...editData, description: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          انصراف
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          ذخیره
        </Button>
      </DialogActions>
    </Dialog>
  );
}
