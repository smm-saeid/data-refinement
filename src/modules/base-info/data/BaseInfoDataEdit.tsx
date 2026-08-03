import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Typography,
} from '@mui/material';
import type { baseInfoData } from './types';

type BaseInfoDataEditProps = {
  open: boolean;
  editData: baseInfoData | null;
  options: { id: number; value: string }[];
  selectedValue: { id: number; value: string } | null;
  setEditData: (v: baseInfoData | null) => void;
  onClose: () => void;
  onSave: () => void;
  check: boolean;
  setCheck: (v: boolean) => void;
  idNum?: number;
  title?: string;
  setSelectedValue: (
    val: { id: number; value: string } | null
  ) => void;
};

export function BaseInfoDataEdit({
  open,
  editData,
  options,
  setEditData,
  setSelectedValue,
  onClose,
  onSave,
  check,
  setCheck,
  idNum,
  title,
  selectedValue,
}: BaseInfoDataEditProps) {
  if (!editData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ویرایش اطلاعات</DialogTitle>
      <DialogContent>
        <TextField
          label="کلید"
          fullWidth
          margin="normal"
          value={editData.key}
          onChange={e => setEditData({ ...editData, key: e.target.value })}
        />
        <TextField
          label="مقدار"
          fullWidth
          margin="normal"
          value={editData.value}
          onChange={e => setEditData({ ...editData, value: e.target.value })}
        />
        <TextField
          label="شماره دستور"
          type="number"
          fullWidth
          margin="normal"
          value={editData.orderNo ?? ''}
          onChange={e => {
            const val = e.target.value;
            setEditData({
              ...editData,
              orderNo: val === '' ? null : Number(val),
            });
          }}
        />
        <Autocomplete
          options={['فعال', 'غیرفعال']}
          value={check ? 'فعال' : 'غیرفعال'}
          onChange={(_, newValue) => setCheck(newValue === 'فعال')}
          renderInput={params => <TextField {...params} label="وضعیت" />}
        />
        <TextField
          label="آیدی نوع اطلاعات پایه"
          fullWidth
          margin="normal"
          value={idNum ?? ''}
          onChange={e =>
            setEditData({
              ...editData,
              commonBaseTypeId:
                e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
        />

        <TextField
          label="نام نوع اطلاعات پایه"
          fullWidth
          margin="normal"
          value={title ?? ''}
          onChange={e =>
            setEditData({
              ...editData,
              commonBaseTypeName: e.target.value,
            })
          }
        />

          <Autocomplete
            options={options}
            getOptionLabel={opt => opt.value}
            value={selectedValue}
            onChange={(_event, newValue) => {
              if (newValue) {
                setSelectedValue(newValue);
              } else {
                setSelectedValue(null);
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
