import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Grid, CircularProgress } from '@mui/material';
import {
  TextFormField,
  DateFormField,
  SelectFormField,
  AutocompleteFormField,
  CheckboxFormField,
  TitleDivider,
  PasswordFormField,
} from './FormField';
import type {
  FormBuilderProps,
  FieldConfig,
  SelectField,
  TOption,
} from './types.ts';

function FormBuilder({
  fields,
  onSubmit,
  value,
  onChange,
  submitButtonText = 'ارسال',
  resetButtonText = 'بازنشانی',
  showResetButton = true,
  showSubmitButton = true,
  loading = false,
}: FormBuilderProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    values: value,
  });

  const [fetchedOptions, setFetchedOptions] = useState<
    Record<string, TOption[]>
  >({});
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (onChange) {
      const subscription = watch(newValues => {
        onChange(newValues);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, onChange]);

  useEffect(() => {
    fields.forEach(async (field: any) => {
      if (
        (field.type === 'select' || field.type === 'autocomplete') &&
        field.fetchOptions
      ) {
        const name = field.name;
        if (fetchedOptions[name]) return;

        setLoadingFields(prev => ({ ...prev, [name]: true }));
        try {
          const options = await field.fetchOptions();
          setFetchedOptions(prev => ({ ...prev, [name]: options }));
        } catch (error) {
          console.error(`Error fetching options for ${name}:`, error);
        } finally {
          setLoadingFields(prev => ({ ...prev, [name]: false }));
        }
      }
    });
  }, [fields, fetchedOptions]);
  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FieldConfig) => {
    if (field.type === 'titleDivider') {
      return (
        <Grid size={12} key={field.name || `divider-${field.label}`}>
          <TitleDivider label={field.label} />
        </Grid>
      );
    }

    if (field.type === 'slot') {
      return (
        <Grid size={field.size} key={field.name}>
          {field.render()}
        </Grid>
      );
    }

    return (
      <Grid size={field.size} key={field.name}>
        <Controller
          name={field.name}
          control={control}
          rules={field.validation}
          render={({ field: controllerField }) => {
            const isDisabled = field.disabled || loading;

            if (field.type === 'text') {
              return (
                <TextFormField
                  name={field.name}
                  label={field.label}
                  controllerField={{
                    ...controllerField,
                    onChange: e => {
                      controllerField.onChange(e);
                      field.onChange?.(e.target.value);
                    },
                  }}
                  errors={errors}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  required={field.required}
                  multiline={(field as any).multiline}
                  rows={(field as any).rows}
                  fontSize={(field as any).fontSize}
                />
              );
            }

            if (field.type === 'password') {
              return (
                <PasswordFormField
                  name={field.name}
                  label={field.label}
                  controllerField={controllerField}
                  errors={errors}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  required={field.required}
                  fontSize={(field as any).fontSize}
                />
              );
            }

            if (field.type === 'date') {
              return (
                <DateFormField
                  name={field.name}
                  label={field.label}
                  value={controllerField.value}
                  onChange={dateValue => {
                    controllerField.onChange(dateValue);
                    field.onChange?.(dateValue);
                  }}
                  errors={errors}
                  format={(field as any).format}
                  disabled={isDisabled}
                  minDate={(field as any).minDate}
                  maxDate={(field as any).maxDate}
                  required={field.required}
                />
              );
            }

            if (field.type === 'select') {
              const selectField = field as SelectField;
              const options =
                fetchedOptions[field.name] || selectField.options || [];
              const isLoading = loadingFields[field.name];

              return (
                <SelectFormField
                  name={field.name}
                  label={field.label}
                  controllerField={{
                    ...controllerField,
                    onChange: e => {
                      controllerField.onChange(e);
                      field.onChange?.(e.target.value);
                    },
                  }}
                  errors={errors}
                  options={options}
                  disabled={isDisabled}
                  required={field.required}
                  loading={isLoading}
                />
              );
            }

            if (field.type === 'autocomplete') {
              const selectField = field as SelectField;
              const options =
                fetchedOptions[field.name] || selectField.options || [];
              const isLoading = loadingFields[field.name];

              return (
                <AutocompleteFormField
                  name={field.name}
                  label={field.label}
                  controllerField={{
                    ...controllerField,
                    onChange: value => {
                      controllerField.onChange(value);
                      field.onChange?.(value);
                    },
                  }}
                  errors={errors}
                  options={options}
                  disabled={isDisabled}
                  required={field.required}
                  loading={isLoading}
                  multiple={selectField.multiple}
                />
              );
            }

            if (field.type === 'checkbox') {
              return (
                <CheckboxFormField
                  name={field.name}
                  label={field.label}
                  controllerField={{
                    ...controllerField,
                    onChange: e => {
                      controllerField.onChange(e);
                      field.onChange?.(e.target.checked);
                    },
                  }}
                  errors={errors}
                  disabled={isDisabled}
                />
              );
            }

            return null;
          }}
        />
      </Grid>
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        {fields.map(renderField)}

        <Grid size={12}>
          <Box
            sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}
          >
            {showResetButton && (
              <Button
                type="button"
                variant="outlined"
                onClick={() => onChange?.(value)}
                disabled={isSubmitting || loading}
              >
                {resetButtonText}
              </Button>
            )}

            {showSubmitButton && (
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                startIcon={
                  isSubmitting && <CircularProgress size={20} color="inherit" />
                }
              >
                {isSubmitting ? 'در حال ارسال...' : submitButtonText}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FormBuilder;
