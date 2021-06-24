import { View, Card } from '@go1d/go1d';

const ContentPreview = () => {
  return (
    <>
      <View flexDirection="row" flexWrap="wrap" backgroundColor="faint">
        <View width={0.25}>
          <Card skeleton />
        </View>
        <View width={0.25}>
          <Card skeleton />
        </View>
        <View width={0.25}>
          <Card skeleton />
        </View>
        <View width={0.25}>
          <Card skeleton />
        </View>
      </View>
      <View marginBottom={4} />
    </>
  );
};
export default ContentPreview;
