// components/FormBuilder/types.ts

export interface TOption {
  value: string | number;
  label: string;
}

export interface BaseField {
  name: string;
  label: string;
  size: GridSize;
  defaultValue?: any;
  disabled?: boolean;
  required?: boolean;
  validation?: any;
  onChange?: (value: any) => void;
}

export interface TextField extends BaseField {
  type: 'text';
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  fontSize?: string;
}

export interface PasswordField extends BaseField {
  type: 'password';
  placeholder?: string;
  fontSize?: string;
}

export interface DateField extends BaseField {
  type: 'date';
  format?: string;
  minDate?: string;
  maxDate?: string;
}

export interface SelectField extends BaseField {
  type: 'select' | 'autocomplete';
  options?: TOption[];
  fetchOptions?: () => Promise<TOption[]>; // ✅ درست شد
  multiple?: boolean;
  loading?: boolean;
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
}

export interface TitleDividerField {
  type: 'titleDivider';
  name?: string;
  label: string;
}

export interface SlotField {
  type: 'slot';
  name: string;
  size: GridSize;
  render: () => React.ReactNode;
}

export type FieldConfig =
  | TextField
  | PasswordField
  | DateField
  | SelectField
  | CheckboxField
  | TitleDividerField
  | SlotField;

export interface GridSize {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface FormBuilderProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => void | Promise<void>;
  value: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  showSubmitButton?: boolean;
  loading?: boolean;
}