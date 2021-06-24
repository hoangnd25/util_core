import { View } from '@go1d/go1d';

type HeroPreviewProps = {
  image: string;
  message: string;
};

const HeroPreview: React.FC<HeroPreviewProps> = ({ image, message }) => {
  return (
    <View
      height={300}
      width="100%"
      alignItems="center"
      justifyContent="center"
      css={{
        background: image ? `url("${image}") repeat center center fixed` : '',
      }}
    >
      <View width="50%" color="soft" dangerouslySetInnerHTML={{ __html: message }} />
    </View>
  );
};
export default HeroPreview;
