// import { useApiQuery } from './hooks/useApi.ts';
// import researchApis from './modules/research/apis.ts';

import { Grid } from "@mui/material";

export default function () {
  // const { data: elites, isLoading } = useApiQuery({
  //   url: researchApis.elites.list,
  //   select: (res) => {
  //     console.log(res);
  //     return res.data;
  //   },
  // });

  // if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Grid container direction="column" spacing={2}>
        <Grid size={{xs: 2, sm: 12}}>
          test
        </Grid>
      </Grid>
    </div>
  );
}