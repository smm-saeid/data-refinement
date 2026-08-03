import SteppButton from './button/SteppButton';

export default function MatnaTabBar({
  tabs,
  selectedTabIndex,
  onSelectTab,
}: {
  tabs: Array<string>;
  selectedTabIndex: number;
  onSelectTab?: (index) => void;
}) {
  return tabs.map((label, index) => {
    return (
      <SteppButton
        key={label}
        activeStep={selectedTabIndex}
        index={index}
        label={label}
        handleStep={onSelectTab}
      />
    );
  });
}
