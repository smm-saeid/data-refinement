import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { useLegacyApi } from "@/hooks/useLegacyApi";
import { PAGINATION_DEFAULT_VALUE_OLD } from "@/types/api";
import paramsSerializer from "@/lib/paramsSerializer";
import { useQuery } from "@tanstack/react-query";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { useNavigate } from "react-router";

export default function FlowRulesTable() {
  const legacyApi = useLegacyApi();

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    ...PAGINATION_DEFAULT_VALUE_OLD,
  });

  const serializedFilters = useMemo(
    () =>
      `flow-rule${paramsSerializer({
        ...filters,
      })}`,
    [filters]
  );

  const {
    data: flowRules,
    isLoading: isLoadingFlowRules,
  } = useQuery({
    queryKey: [serializedFilters],
    queryFn: () => legacyApi.get(serializedFilters),
  });

  useEffect(() => {
    console.log("flow Rules: ", flowRules);
  }, [flowRules]);

  const handleOpenGraph = (flow) => {

    const url = `/flow-graph/${flow.id}?name=${encodeURIComponent(flow.name)}`;
    


    navigate(url);
    // window.open(url, "_blank", "noopener,noreferrer");
  };


  const stepCounts = [null, null, null, null];

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        {isLoadingFlowRules ? (
          <CircularProgress sx={{ m: 2 }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ردیف</TableCell>
                <TableCell>عنوان</TableCell>
                <TableCell>زیر سیستم</TableCell>
                <TableCell>تعداد مراحل</TableCell>
                <TableCell>نمایش گراف</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {flowRules?.data?.rows?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>عملیات</TableCell>
                  <TableCell>{stepCounts[index] ?? "-"}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => handleOpenGraph(item)}
                    >
                      <AccountTreeOutlinedIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
}