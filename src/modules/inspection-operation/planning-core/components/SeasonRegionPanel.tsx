import { Box, Skeleton, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import type { APISuggestionUnit } from '../../types.ts';

type Props = {
  data: Array<APISuggestionUnit>;
  status: string;
  organization: string;
};
export type RegionData = {
  id: number;
  region: string;
  code: string;
};
const SeasonRegionPanel: React.FC<Props> = ({
  data,
  status = 'success',
}) => {
  const filteredData = data;

  const rows = useMemo(
    (): RegionData[] => [
      { id: 1, region: 'شمال شرق', code: 'north_east' },
      { id: 2, region: 'شمال', code: 'north' },
      { id: 3, region: 'شمال غرب', code: 'north_west' },
      { id: 4, region: 'شرق', code: 'east' },
      { id: 5, region: 'مرکز', code: 'center' },
      { id: 6, region: 'غرب', code: 'west' },
      { id: 7, region: 'جنوب شرق', code: 'south_east' },
      { id: 8, region: 'جنوب', code: 'south' },
      { id: 9, region: 'جنوب غرب', code: 'south_west' },
    ],
    [data, filteredData]
  );

  // const columns: GridColDef[] = useMemo(
  //   () => [
  //     {
  //       field: "region",
  //       headerName: "برنامه فصلی - منطقه ای بازرسی ها",
  //       flex: 2,
  //       sortable: false,
  //       renderCell: ({ row }: { row: RegionData }) => {
  //         let itemsnumber = filteredData.filter((monthRow) => monthRow.region === row.code).length;
  //         let percent = ((itemsnumber / filteredData.length) * 100).toFixed(2);
  //         return (
  //           <Box sx={{display:'flex',height:"100%", flexDirection:'column'}} alignItems="center" justifyContent="center"  >

  //             <Typography variant="subtitle1" component="div" fontWeight={"bold"}>
  //               {row.region}
  //             </Typography>
  //             <Typography variant="body2" component="div" >
  //               ({percent+"%"})
  //             </Typography>

  //           </Box>
  //         );
  //       },
  //     },
  //     {
  //       field: "type0",
  //       headerAlign: "center",
  //       headerName: "بهار",
  //       flex: 1.5,
  //       sortable: false,
  //       renderCell: ({ row }: { row: RegionData }) => {
  //         let items = filteredData
  //           .filter((monthRow) => monthRow.region === row.code && 0 <= seasonKeys.findIndex((season)=>season===monthRow.month) / 3 && seasonKeys.findIndex((season)=>season===monthRow.month) / 3 < 1)
  //           .map((item) => (
  //             <div>
  //               {item.organizationUnitName} ({SeasonData[seasonKeys.findIndex((season)=>season===item.month)]})
  //             </div>
  //           ));
  //         return items.length ? (
  //           <Card sx={{ width: "100%" }}>
  //             <CardContent>{items}</CardContent>
  //           </Card>
  //         ) : (
  //           ""
  //         );
  //       },
  //     },
  //     {
  //       field: "type1",
  //       headerAlign: "center",
  //       headerName: "تابستان",
  //       flex: 1.5,
  //       sortable: false,
  //       renderCell: ({ row }: { row: RegionData }) => {
  //         let items = filteredData
  //           .filter((monthRow) => monthRow.region === row.code && 1 <= seasonKeys.findIndex((season)=>season===monthRow.month) / 3 && seasonKeys.findIndex((season)=>season===monthRow.month) / 3 < 2)
  //           .map((item) => (
  //             <div>
  //               {item.organizationUnitName} ({SeasonData[seasonKeys.findIndex((season)=>season===item.month)]})
  //             </div>
  //           ));
  //         return items.length ? (
  //           <Card sx={{ width: "100%" }}>
  //             <CardContent>{items}</CardContent>
  //           </Card>
  //         ) : (
  //           ""
  //         );
  //       },
  //     },
  //     {
  //       field: "type2",
  //       headerAlign: "center",
  //       headerName: "پاییز",
  //       flex: 1.5,
  //       sortable: false,
  //       renderCell: ({ row }: { row: RegionData }) => {
  //         let items = filteredData
  //           .filter((monthRow) => monthRow.region === row.code && 2 <= seasonKeys.findIndex((season)=>season===monthRow.month) / 3 && seasonKeys.findIndex((season)=>season===monthRow.month) / 3 < 3)
  //           .map((item) => (
  //             <div>
  //               {item.organizationUnitName} ({SeasonData[seasonKeys.findIndex((season)=>season===item.month)]})
  //             </div>
  //           ));
  //         return items.length ? (
  //           <Card sx={{ width: "100%" }}>
  //             <CardContent>{items}</CardContent>
  //           </Card>
  //         ) : (
  //           ""
  //         );
  //       },
  //     },
  //     {
  //       field: "type3",
  //       headerAlign: "center",
  //       headerName: "زمستان",
  //       flex: 1.5,
  //       sortable: false,
  //       renderCell: ({ row }: { row: RegionData }) => {
  //         let items = filteredData
  //           .filter((monthRow) => monthRow.region === row.code && 3 <= seasonKeys.findIndex((season)=>season===monthRow.month) / 3 && seasonKeys.findIndex((season)=>season===monthRow.month) / 3 < 4)
  //           .map((item) => (
  //             <div>
  //               {item.organizationUnitName} ({SeasonData[seasonKeys.findIndex((season)=>season===item.month)]})
  //             </div>
  //           ));
  //         return items.length ? (
  //           <Card sx={{ width: "100%" }}>
  //             <CardContent>{items}</CardContent>
  //           </Card>
  //         ) : (
  //           ""
  //         );
  //       },
  //     },
  //   ],
  //   [data]
  // );
  return (
    <Box sx={{ p: 4, borderRadius: 1, width: '100%', pa: 0 }}>
      {
        // status === "error" ? (<ErrorHandler onRefetch={refetch}/>) :
        status === 'loading' ? (
          <Skeleton height={300} />
        ) : (
          // status === "success" ?
          // <TavanaDataGrid
          //   rows={rows}
          //   columns={columns}
          //   loading={false}
          //   hideFooter
          //   getRowHeight={() => "auto"}
          //   sx={{
          //     borderColor: "#023e8a",
          //     borderWidth: "2px",
          //     fontSize: "smaller",
          //     width: "100%",
          //   }}
          // />
          <Typography></Typography>
        )
        // : null
      }
    </Box>
  );
};

export default SeasonRegionPanel;
