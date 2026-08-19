import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBtnProps {
  onClick: () => void;
}

export default function SearchBtn({ onClick }: SearchBtnProps) {
  return (
    <Button variant="contained" onClick={onClick} startIcon={<SearchIcon />}>
      جستجو
    </Button>
  );
}
