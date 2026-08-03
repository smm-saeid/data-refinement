import { Box, Typography, Grid } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import type { PasswordPolicy, PasswordValidation } from '../../types';

interface PasswordPolicyDisplayProps {
  validation: PasswordValidation;
  policy: PasswordPolicy;
}

export function PasswordPolicyDisplay({
  validation,
  policy,
}: PasswordPolicyDisplayProps) {
  const policyItems = [
    {
      key: 'length',
      label: `حداقل ${policy.minLength} کاراکتر`,
      isValid: validation.length,
    },
    {
      key: 'uppercase',
      label: `حداقل یک حرف بزرگ`,
      isValid: validation.uppercase,
    },
    {
      key: 'lowercase',
      label: `حداقل یک حرف کوچک`,
      isValid: validation.lowercase,
    },
    {
      key: 'specialChars',
      label: `حداقل یک کاراکتر خاص`,
      isValid: validation.specialChars,
    },
    {
      key: 'digits',
      label: `حداقل یک عدد`,
      isValid: validation.digits,
    },
  ];

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        شرایط رمز عبور:
      </Typography>

      <Grid container spacing={1}>
        {policyItems.map(item => (
          <Grid item xs={12} sm={6} key={item.key}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.isValid ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Cancel color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={item.isValid ? 'success.main' : 'error.main'}
                sx={{ fontSize: '0.8rem' }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
