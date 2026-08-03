import { Box, Button } from "@mui/material";
import React from "react";
import { type OrganizationsInfo, OrganizationsInfoTitles, organizationTypes, type ServiceInterface } from "../types";
interface MyProps {
  data: ServiceInterface | undefined;
  click: (e: React.SyntheticEvent, value: number) => void;
  selected: number | undefined;
  disable?:boolean
}
export default function ServiceTabs (props: MyProps) {

  const organizations = Object.keys(OrganizationsInfoTitles)
  return (
    <Box pt={1} m={2} ml={0}>
      {organizations?.map((organizatinItem, index) => (
        <Button
          disabled={props?.disable && props.selected !== index}
          key={index}
          sx={{ marginRight: "10px" }}
          variant={props.selected === index ?"contained":"outlined"}
          onClick={(e) => props.click(e, index)}
        >
          {organizationTypes[organizatinItem as keyof OrganizationsInfo]}
        </Button>
      ))}
    </Box>
  );
};
