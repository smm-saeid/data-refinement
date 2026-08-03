import { ArrowCircleDown, ArrowCircleLeftOutlined } from '@mui/icons-material';
import { Tab, Tabs } from '@mui/material';

export default function InspectionNatureTabs({
  natures,
  selectedNatureId,
  onClick,
}) {
  const selected = selectedNatureId
    ? selectedNatureId
    : natures[0]?.organizationTypeId;

  return (
    <Tabs value={selected} onChange={onClick}>
      {natures.map((naturItem, natureKey) => (
        <Tab
          wrapped
          key={`nature-${natureKey}`}
          value={naturItem?.organizationTypeId}
          label={naturItem.organizationTypeName}
          icon={
            selected !== naturItem.organizationTypeId ? (
              <ArrowCircleLeftOutlined sx={{ fontSize: 30, m: 1 }} />
            ) : (
              <ArrowCircleDown sx={{ fontSize: 30, m: 1 }} />
            )
          }
          iconPosition="start"
        />
      ))}
    </Tabs>
  );
}
