import { AssignmentInd } from "@mui/icons-material";
import { Grid, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import InspectorsGrid from "./components/InspectorsGrid";
import IndividualAssessment from "./components/IndividualAssessment";
import BackButton from "@/components/button/BackButton";
import { useNavigate } from "react-router";

const Pointsteps = () => {
  const navigate = useNavigate();
  const [selectedReportType, setselectedReportType] = useState(0);
  const reportType = ["بازرسان", "ارزیابی انفرادی"];
  return (
    <Grid container justifyContent={"center"}>
      <Grid size={{md:11}} container justifyContent={"space-between"}>
        <Grid display={"flex"} justifyContent={"flex-start"}>
          <AssignmentInd fontSize="large" />
          <Typography variant="h6">{selectedReportType === 0 ? "بازبینه های بازرسان" : "ارزیابی انفرادی"}</Typography>
        </Grid>
        <Grid display={"flex"} justifyContent={"flex-start"}>
          <Tabs
            sx={{ mb: 2, mr: 2 }}
            value={selectedReportType}
            onChange={(e: React.SyntheticEvent, value: number) => setselectedReportType(value)}
          >
            {reportType.map((item, index) => (
              <Tab wrapped key={index} value={index} label={item} />
            ))}
          </Tabs>
          <BackButton />
        </Grid>
      </Grid>
      {selectedReportType === 0 ? (
        <InspectorsGrid />
      ) : (
        <IndividualAssessment />
      )}
    </Grid>
  );
};

export default Pointsteps;
