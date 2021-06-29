import { View, Container, ButtonMinimal, ViewProps } from '@go1d/go1d';
import { IconGo1Logo } from '@go1d/go1d/build/components/Icons';

type TopbarPreviewProps = {
  icon: string;
};
const TopbarPreview: React.FC<TopbarPreviewProps> = ({ icon }) => {
  return (
    <>
      <MenuWrapper display={['flex', 'none', 'none']} paddingY={2}>
        <MainIcon marginX="auto" icon={icon} />
      </MenuWrapper>
      <MenuWrapper display={['none', 'flex', 'flex']}>
        <MainIcon icon={icon} />
      </MenuWrapper>
    </>
  );
};
export default TopbarPreview;

type MainIconProps = ViewProps & {
  icon?: string;
};
const MainIcon = ({ icon, ...props }: MainIconProps) => {
  return (
    <ButtonMinimal
      css={{
        '&:hover, &:active, &:focus': { background: 'transparent' },
      }}
      {...(props as any)}
      maxWidth={128}
      paddingX={2}
    >
      {icon ? (
        <View data-testid="preview-dashboard-icon" element="img" src={icon} style={{ maxHeight: 40 }} />
      ) : (
        <IconGo1Logo color="successLowest" size={[8, 6, 6]} />
      )}
    </ButtonMinimal>
  );
};

const MenuWrapper = ({ children, ...props }) => (
  <View backgroundColor="background" borderBottom={1} borderColor="highlight" {...props}>
    <Container alignItems="center" flexDirection="row" contain="wide" paddingX={[3, 4, 4]} minHeight={71}>
      {children}
    </Container>
  </View>
);
