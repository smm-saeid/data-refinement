import { Grid, Box, Typography } from "@mui/material";

export default function MatnaStepper({
  steps,
  selectedStep,
}: {
  steps: Array<any>;
  selectedStep: number;
}) {
  const length = steps.length;

  return (
    <Grid
      container
      rowSpacing={2}
      marginBottom={'50px'}
      justifyContent={'center'}
    >
      {steps.map((step, key) => (
        <Grid
          size={{ xs: 4, md: Math.max(2, 12 / length)  }}
          key={key}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              border: key !== 0 ? 'solid 1px' : 'none',
              borderColor: theme =>
                key > selectedStep ? 'grey' : theme.palette.primary.dark,
              width: '15%',
              opacity: key > selectedStep ? 0.2 : 1.0,
            }}
          ></Box>
          <Box
            sx={{
              width: '70%',
              height: '60px',
              borderRadius: '8px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme =>
                key > selectedStep ? theme.palette.text.primary : 'white',
              // backgroundColor: ,
              backgroundColor: theme =>
                key > selectedStep ? 'grey' : theme.palette.primary.dark,
              opacity:
                key > selectedStep ? 0.6 : key < selectedStep ? 0.6 : 1.0,
            }}
          >
            <Typography fontSize={'0.8em'}>{step}</Typography>
          </Box>
          <Box
            sx={{
              border: key !== steps.length - 1 ? 'solid 1px' : 'none',
              borderColor: theme =>
                key >= selectedStep ? 'grey' : theme.palette.primary.dark,
              width: '15%',
              opacity: key < selectedStep ? 1.0 : 0.2,
            }}
          ></Box>
        </Grid>
      ))}
    </Grid>
  );
}