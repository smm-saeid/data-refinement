import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import type { IRenderFormInput, TOption } from '@/types/render';
import PasswordInput from './PasswordInput';
import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker.tsx';

const RenderFormInput: React.FC<IRenderFormInput> = props => {
  const {
    name,
    label,
    errors,
    elementProps,
    controllerField,
    defaultValue,
    fontSize,
    value,
    onChange,
  } = props;
  if (props.inputType === 'text') {
    return (
      <TextField
        {...controllerField}
        value={controllerField?.value ?? ''}
        name={name}
        label={label}
        error={Boolean(errors?.[name]?.message)}
        helperText={errors?.[name]?.message}
        fullWidth
        size="small"
        {...elementProps}
        onChange={(e) => {
          controllerField.onChange(e);
          if (onChange) {
            onChange(e);
          }
        }}
      />
    );
  }
  if (props.inputType === 'password') {
    return (
      <PasswordInput
        name={name}
        label={label}
        errors={errors?.[name]?.message}
        controllerField={controllerField}
        elementProps={elementProps}
      />
    );
  }
  if (props.inputType === 'date') {
    const { setValue, watch, format } = props;

    return (
      <MatnaDatePicker
        name={name}
        label={label}
        setDay={day => setValue(name, day)}
        // value={watch(name)}
        value={elementProps.value}
        format={format}
        {...elementProps}
        error={errors?.[name]?.message}
      />
    );
  }
  if (props.inputType === 'autocomplete') {
    const { options, status } = props;
    if (status === 'loading') return <LoadingState label={label} />;
    return (
      <Autocomplete
        {...controllerField}
        {...elementProps}
        options={options}
        //@ts-ignore
        getOptionLabel={(option: TOption) => {
          if (typeof option !== 'object') {
            const result = options.find((op: TOption) => op?.value === option);
            return result?.title || '';
          }
          return option?.title || '';
        }}
        filterOptions={(ops, state) => {
          //@ts-ignore
          const temp = ops?.filter((op: TOption) =>
            op?.title?.includes(state?.inputValue)
          );
          return temp;
        }}
        value={controllerField?.value}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            error={Boolean(errors?.[name]?.message)}
            helperText={errors?.[name]?.message}
            size="small"
          />
        )}
      />
    );
  }

  if (props.inputType === 'customautocomplete') {
    const { options, status } = props;
    if (status === 'loading') return <LoadingState label={label} />;
    return (
      <Autocomplete
        {...controllerField}
        {...elementProps}
        options={options}
        // slotProps={{
        //  paper:{
        //    sx:{
        //      "& .MuiOutlinedInput-root": {paddingLeft:"0px !important"}
        //    }
        //  }
        // }
        // }

        sx={{
          '& .MuiOutlinedInput-root': {
            padding: '5px  50px 5px  0px!important',
          },
        }}
      />
    );
  }

  if (props.inputType === 'select') {
    const { options, status } = props;
    if (status === 'loading') return <LoadingState label={label} />;
    return (
      <FormControl fullWidth required={elementProps?.required}>
        <InputLabel id={`select-input-${name}`}>{label}</InputLabel>
        <Select
          labelId={`select-input-${name}`}
          label={label}
          {...controllerField}
          {...elementProps}
          error={Boolean(errors?.[name]?.message)}
          size="small"
        >
          {options?.map((option: TOption) => (
            <MenuItem
              key={`${name}-select-item-${option.value}`}
              value={option.value}
            >
              {option.title}
            </MenuItem>
          ))}
        </Select>
        {Boolean(errors?.[name]?.message) && (
          <FormHelperText error={true}>
            {errors?.[name]?.message}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
  // if (props.inputType === "city") {
  //   const { setValue, disabled, cityId } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   return <SelectCity label={label} name={name} setValue={setValue} disabled={disabled} cityId={cityId} />;
  // }
  if (props.inputType === 'checkbox') {
    const { setValue, disabled = false } = elementProps;
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              size="small"
              disabled={disabled}
              checked={props?.value}
              onChange={setValue}
            />
          }
          label={label}
          {...controllerField}
          {...elementProps}
        />
        {Boolean(errors?.[name]?.message) && (
          <FormHelperText error={true}>
            {errors?.[name]?.message}
          </FormHelperText>
        )}
      </FormGroup>
    );
  }
  /**
   * @description form divider with title
   */
  if (props.inputType === 'titleDivider') {
    return (
      <Box width="100%">
        <Typography>{label}</Typography>
      </Box>
    );
  }

  // if (props.inputType === "location") {
  //   const { setValue, watch } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   if (!watch) throw Error("watch is not defined");
  //   return <SelectLocation watch={watch} setValue={setValue} />;
  // }

  return <h1>not supported type</h1>;
};

export default RenderFormInput;

export const LoadingState: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <Box sx={{ minHeight: '40px' }}>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <LinearProgress />
    </Box>
  );
};
