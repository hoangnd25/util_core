import { View } from '@go1d/go1d';

type HeroPreviewProps = {
  image: string;
  message: string;
};

const HeroPreview: React.FC<HeroPreviewProps> = ({ image, message }) => {
  return (
    <View
      data-testid="preview-dashboard-image"
      height={300}
      width="100%"
      alignItems="center"
      justifyContent="center"
      css={{
        background: image ? `url("${image}") repeat center center fixed` : '',
      }}
    >
      <View
        data-testid="preview-dashboard-welcome-message"
        width="50%"
        color="soft"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </View>
  );
};
export default HeroPreview;
