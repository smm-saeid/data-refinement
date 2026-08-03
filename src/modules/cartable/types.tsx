import {
  Assignment as CurrentIcon,
  CheckCircle as CompletedIcon,
  Send as SendIcon,
  ViewList as AllIcon,
  EmailOutlined as EmailIcon,
} from '@mui/icons-material';

export enum WorkflowStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REJECTED = 'rejected',
}

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;

  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
  };
  assignedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  senderName: string;
  senderLastname: string;
  senderRole: string;
  recipientName: string;
  recipientLastname: string;
  recipientRole: string;

  currentStep: number;
  totalSteps: number;
  steps: WorkflowStep[];
  flowRuleSectionId?: string;

  category?: string;
  tags?: string[];
  attachments?: Attachment[];
  documentId;
  entityName;
  operation;
}

export interface WorkflowStep {
  id: string;
  title: string;
  status: WorkflowStatus;
  assignedTo: {
    id: string;
    name: string;
  };
  completedAt?: string;
  comment?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface CartableFilter {
  search?: string;
  status?: WorkflowStatus[];
  dateFrom?: string;
  dateTo?: string;
  category?: string;
}

export const CartableTab = {
  PENDING: {
    key: 'PENDING',
    label: 'کارهای جاری',
    color: 'warning',
    icon: <CurrentIcon />,
  },
  SENT: {
    key: 'SENT',
    label: 'ارسال شده',
    color: 'primary',
    icon: <SendIcon />,
  },
  APPROVED: {
    key: 'APPROVED',
    label: 'به اتمام رسیده',
    color: 'success',
    icon: <CompletedIcon />,
  },
  ALL: {
    key: 'ALL',
    label: 'تمام کارها',
    color: 'secondary',
    icon: <AllIcon />,
  },
  NOTICE: {
    key: 'ANNOUNCEMENT',
    label: 'ابلاغیه ها',
    color: 'warning',
    icon: <EmailIcon />,
  }
} as const;

