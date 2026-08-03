import { Box, Badge, Button } from '@mui/material';
import React from 'react';
import { type APINature, type AnnualPlanning } from '../types';
import {
  inspectionTypeNames,
  type OrganizationsInfo,
  OrganizationsInfoTitles,
  organizationTypes,
} from '../types';

type Props = {
  click: (e: React.SyntheticEvent, value: number, view: number) => void;
  selectedOrganization: number;
  selectedInspectionType: string;
  plan: AnnualPlanning;
  disable?: boolean;
};

const OrganizationTabs = (props: Props) => {
  const organizations = Object.keys(OrganizationsInfoTitles);

  const nirooSum = (organizatinItem: keyof OrganizationsInfo) => {
    const myNaturs =
      props.plan?.inspectionType
        ?.find(
          item =>
            item.key ===
            (props.selectedInspectionType as keyof typeof inspectionTypeNames)
        )
        ?.organizations?.find(organ => organ.key === organizatinItem)
        ?.organizationType ?? ([] as APINature[]);

    return myNaturs.reduce((total, natureItem) => {
      return total + +(natureItem.number ?? 0);
    }, 0);
  };

  // let remainingOfInspectionType: number = organizations.reduce(
  //   (acc, key) => acc - nirooSum(key as keyof OrganizationsInfo),
  //   props.plan?.INSPECTIONTYPES?.[props.selectedInspectionType as keyof typeof inspectionTypeNames].TOTAL
  // );

  return (
    <Box pt={1} mt={1}>
      {organizations.map(
        (organizatinItem: string, organizationindex: number) => (
          <Badge
            showZero
            key={organizationindex}
            sx={{ marginRight: '15px' }}
            badgeContent={
              nirooSum(organizatinItem as keyof OrganizationsInfo) ?? 0
            }
            color={
              (props.plan?.inspectionType
                ?.find(
                  item =>
                    item.key ===
                    (props.selectedInspectionType as keyof typeof inspectionTypeNames)
                )
                ?.organizations?.find(organ => organ.key === organizatinItem)
                ?.number ?? 0) <
              nirooSum(organizatinItem as keyof OrganizationsInfo)
                ? 'error'
                : (props.plan?.inspectionType
                      ?.find(
                        item =>
                          item.key ===
                          (props.selectedInspectionType as keyof typeof inspectionTypeNames)
                      )
                      ?.organizations?.find(
                        organ => organ.key === organizatinItem
                      )?.number ?? 0) ==
                    nirooSum(organizatinItem as keyof OrganizationsInfo)
                  ? 'success'
                  : 'secondary'
            }
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Button
              key={organizationindex}
              variant={
                props.selectedOrganization === organizationindex
                  ? 'contained'
                  : 'outlined'
              }
              onClick={e =>
                props.click(e, organizationindex, organizationindex)
              }
              disabled={
                props.disable &&
                props.selectedOrganization !== organizationindex
              }
            >
              {organizationTypes[organizatinItem as keyof OrganizationsInfo]}
              &nbsp; (
              {
                props.plan?.inspectionType
                  ?.find(
                    item =>
                      item.key ===
                      (props.selectedInspectionType as keyof typeof inspectionTypeNames)
                  )
                  ?.organizations?.find(organ => organ.key === organizatinItem)
                  ?.number
              }
              )
            </Button>
          </Badge>
        )
      )}

      {/* <Grid
          sx={{ display:'inline-block',color: remainingOfInspectionType > 0 ? "black" : remainingOfInspectionType === 0 ? "green" : "red",
          }}
        >
          {!isNaN(remainingOfInspectionType) && ( remainingOfInspectionType < 0 ? (
            <span>
              (بیش از حد مجاز: <span dir="ltr"> {Math.abs(remainingOfInspectionType)}</span>)
            </span>
          ) : (
            <span>
              (باقیمانده: <span dir="ltr"> {remainingOfInspectionType}</span>)
            </span>
          ))}
        </Grid> */}
    </Box>
  );
};

export default OrganizationTabs;
