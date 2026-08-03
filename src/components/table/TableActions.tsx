import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ChangeCircleOutlined, InfoOutlined, Launch, ManageHistory, Preview, Upload } from "@mui/icons-material";
import type {OverridableStringUnion} from "@mui/types";
import type {IconButtonPropsColorOverrides} from "@mui/material/IconButton";



export type TableActionType = {
  title: string;
  icon: React.ReactElement;
  disabled?: boolean;
  color?: OverridableStringUnion<
    'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    IconButtonPropsColorOverrides
  >;
  handler: (event: any) => void
}

type Props = {
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
  onManage?: (record: any) => void;
  onChangeState?: (record: any) => void;
  onReference?: (record: any) => void;
  onReferenceView?: (record: any) => void;
  onDetermining?: (record: any) => void;
  onUpload?: (record: any) => void;
  onReviewAndScoring?: (record: any) => void;
  actions?: Array<TableActionType>;
};

const TableActions: React.FC<Props> = ({
  onEdit,
  onDelete,
  onView,
  onManage,
  onReviewAndScoring,
  onChangeState,
  onReference,
  onReferenceView,
  onDetermining,
  onUpload,
  actions = null
}) => {
  return (
    <Box>
      {onView && (
        <Tooltip title="نمایش" arrow>
          <IconButton onClick={onView} color="primary">
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {onManage && (
        <Tooltip title="مدیریت طرح ریزی" arrow>
          <IconButton onClick={onManage} color="primary">
            <ManageHistory />
          </IconButton>
        </Tooltip>
      )}
      {onReviewAndScoring && (
        <Tooltip title="بررسی و امتیازدهی" arrow>
          <IconButton onClick={onReviewAndScoring} color="primary">
            <ManageHistory />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="ویرایش" arrow>
          <IconButton onClick={onEdit} color="info">
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {onChangeState && (
        <Tooltip title="تغیر وضعیت" arrow>
          <IconButton onClick={onChangeState} color="warning">
            <ChangeCircleOutlined />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="حذف" arrow>
          <IconButton onClick={onDelete} color="error">
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {onUpload && (
        <Tooltip title="آپلود" arrow>
          <IconButton onClick={onUpload} color="success">
            <Upload />
          </IconButton>
        </Tooltip>
      )}
      {onReference && (
        <Tooltip title="ارجاع" arrow>
          <IconButton onClick={onReference} color="info">
            <Launch />
          </IconButton>
        </Tooltip>
      )}
      {onReferenceView && (
        <Tooltip title="شرح ارجاع" arrow>
          <IconButton onClick={onReferenceView} color="error">
            <Preview />
          </IconButton>
        </Tooltip>
      )}
      {onDetermining && (
        <Tooltip title="تعیین نوع شکایت" arrow>
          <IconButton onClick={onManage} color="primary">
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      )}
      {
        actions?.length !== 0 && !!actions ? (<>
          {
            actions.map((action, index) => <Tooltip key={index} title={action.title} arrow>
              <IconButton sx={{ paddingTop: "5px" }}
                onClick={action.handler}
                disabled={!!action.disabled}
                size="small"
                color={action.color || 'primary'}>
                {action.icon}
              </IconButton>
            </Tooltip>)
          }
        </>) : null
      }

    </Box>
  );
};

export default TableActions;
