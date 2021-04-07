import { ButtonFilled, Field, ImageUploader, ImageUploadSlat, View } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import SettingsBlockMaker from '@src/components/Settings/SettingsBlockMaker';
import { FunctionComponent } from 'react';
import SettingsFormSection from '../SettingsFormSection';

const FEATURED_IMAGE_RATIO = 1;

const DashedBorder: FunctionComponent = ({ children }) => (
  <View
    padding={4}
    borderRadius={2}
    border={1}
    borderColor="delicate"
    css={{
      borderStyle: 'dashed',
    }}
  >
    {children}
  </View>
);

interface Props {
  isSaving?: boolean;
  onFeaturedImageCropped?: (image: Blob) => void;
}

const SectionBrand: FunctionComponent<Props> = ({ isSaving, onFeaturedImageCropped }) => {
  return (
    <SettingsFormSection
      title={<Trans>Brand</Trans>}
      actionButton={
        <ButtonFilled>
          <Trans>Preview brand</Trans>
        </ButtonFilled>
      }
    >
      <SettingsBlockMaker
        marginBottom={5}
        title={<Trans>Logo</Trans>}
        description={<Trans>For best results, upload your logo in a 1:1 ratio with a transparent background.</Trans>}
      >
        <DashedBorder>
          <Field component={ImageUploadSlat} name="logo" hideLabel required disabled={isSaving} />
        </DashedBorder>
      </SettingsBlockMaker>
      
      <SettingsBlockMaker
        title={<Trans>Featured image</Trans>}
        description={
          <Trans>
            Used in sign up and login pages. For best results, upload an image in 1:1 ratio. The image can also be
            repositioned.
          </Trans>
        }
      >
        <DashedBorder>
          <Field
            name="featuredImage"
            allowCrop
            hideLabel
            component={ImageUploader}
            height={400}
            cropConfig={{
              aspect: FEATURED_IMAGE_RATIO,
              onCrop: onFeaturedImageCropped,
            }}
          />
        </DashedBorder>
      </SettingsBlockMaker>
    </SettingsFormSection>
  );
};

export default SectionBrand;
