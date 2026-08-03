import type {
  AutocompleteProps,
  CheckboxProps,
  GridProps,
  MenuItemProps,
  SelectProps,
  TextFieldProps,
} from '@mui/material';
import type { QueryStatus } from '@tanstack/react-query';
import type { UseFormSetValue } from 'react-hook-form';
import type { DayValue } from '@hassanmojab/react-modern-calendar-datepicker';
import type { DatePickerProps } from '@mui/x-date-pickers';
import type { ReactNode } from 'react';

type TInputTypes =
  | 'text'
  | 'autocomplete'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'password'
  | 'city';

interface IBaseInput<TInputTypes> {
  inputType: TInputTypes;
  label: string | ReactNode;
  name: string;
  gridProps?: GridProps;
}

export type TOption = MenuItemProps | { title: any; value: any };

interface IText extends IBaseInput<'text' | 'password'> {
  elementProps?: TextFieldProps;
}

interface ISelect extends IBaseInput<'select'> {
  elementProps?: SelectProps;
  options: TOption[];
  status?: QueryStatus;
  refetch?: () => void;
}

interface IAutocomplete extends IBaseInput<'autocomplete'> {
  elementProps?: AutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent
  >;
  options: TOption[];
  status?: QueryStatus;
  refetch?: () => void;
}

interface ICheckbox extends IBaseInput<'checkbox'> {
  elementProps?: CheckboxProps;
}

interface IDate extends IBaseInput<'date'> {
  format?: string;
  elementProps?: Optional<DatePickerProps<DayValue>>;
}

interface ICitySelect extends IBaseInput<'city'> {
  elementProps?: CheckboxProps;
}

export type IRenderInput =
  | IText
  | ISelect
  | IAutocomplete
  | ICheckbox
  | IDate
  | ICitySelect
  | IBoolean;

export type IRenderFormInput = IRenderInput & {
  errors: any;
  controllerField: any;
  setValue?: UseFormSetValue<T>;
  watch?: any;
  required?: boolean;
};
