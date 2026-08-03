import { Grid, IconButton, Tooltip } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { type GridColDef } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';
import ReviewSelectionModal from 'modules/inspection-operation/verfication/ReviewSelectionModal.tsx';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import PaginatedMatnaDataGrid from 'components/data-grid/PaginatedMatnaDataGrid.tsx';

export default function InspectorsGrid() {
  const { id } = useParams();
  const [selectecPersonId, setSelectecPersonId] = useState<string>();
  const [reviewFlag, setReviewFlag] = useState<boolean>(false);
  const legacyApi = useLegacyApi();

  const {
    data: personSpeciality,
    status: personSpeciality_status,
    refetch: personSpeciality_refetch,
  } = useQuery<any, any, any, any>({
    queryKey: [
      `person-speciality-review-group/find-by-person-speciality-id-for-grading?personSpecialityId=${selectecPersonId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `person-speciality-review-group/find-by-person-speciality-id-for-grading?personSpecialityId=${selectecPersonId}`
      ),
    select: (res: any) => res.data as any,
    enabled: !!selectecPersonId,
    // placeholderData: [],
  });

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'personInfoName',
        headerName: 'نام بازرس',
        flex: 1,
        display: 'flex',
      },
      {
        field: 'personInfoFamily',
        headerName: 'نام خانوادگی',
        flex: 1,
        display: 'flex',
      },
      {
        field: 'orgSpecialityName',
        headerName: 'نام تخصص',
        flex: 1,
      },
      {
        field: 'organizationUnitName',
        headerName: 'یگان خدمتی',
        flex: 1,
      },
      {
        field: 'position',
        headerName: 'جایگاه شغلی',
        flex: 1,
      },

      {
        display: 'flex',
        headerName: 'عملیات',
        field: 'action',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: { row: any }) => {
          return (
            <Tooltip title="انتخاب بازرس">
              <IconButton
                color="info"
                onClick={() => {
                  setSelectecPersonId(row?.id.toString());
                  setReviewFlag(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Grid container size={{ md: 11 }} mt={2} justifyContent={'center'}>
      <PaginatedMatnaDataGrid
        url={'person-speciality/find-by-inspection'}
        params={{ inspectionId: id }}
        columns={columns}
        numberOfRowsInPage={10}
      />
      <ReviewSelectionModal
        reviewFlag={reviewFlag}
        setReviewFlag={setReviewFlag}
        personSpeciality={personSpeciality}
      />
    </Grid>
  );
}
