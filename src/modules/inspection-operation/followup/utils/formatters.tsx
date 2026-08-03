import {
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Error as ErrorIcon,
    PictureAsPdf,
    Image,
    Description,
    InsertDriveFile,
} from '@mui/icons-material';

export const formatDate = (dateString?: string | number | null): string => {
    if (!dateString) return '---';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return '---';
    }
};

export const formatTime = (dateString?: string): string => {
    if (!dateString) return '---';
    try {
        return new Date(dateString).toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '---';
    }
};

export const getFileIcon = (fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'pdf': return <PictureAsPdf color="error" />;
        case 'jpg':
        case 'jpeg':
        case 'png': return <Image color="primary" />;
        case 'doc':
        case 'docx': return <Description color="info" />;
        default: return <InsertDriveFile />;
    }
};

export const getStatusIcon = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('pending')) return <CheckCircleIcon color="success" />;
    if (s.includes('rejected')) return <ErrorIcon color="error" />;
    if (s.includes('in_progress')) return <PendingIcon color="info" />;
    return <PendingIcon color="disabled" />;
};
