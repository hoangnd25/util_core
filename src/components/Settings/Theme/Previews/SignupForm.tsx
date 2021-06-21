import { View, TextInput, foundations } from '@go1d/go1d';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import IconEye from '@go1d/go1d/build/components/Icons/Eye';

const SignupForm = () => (
  <I18n>
    {({ i18n }) => (
      <View width="100%">
        <View flexDirection="row" display="flex" marginY={3} justifyContent="space-between" width="100%">
          <View paddingRight={1} flexShrink={1} flexGrow={1} width="50%">
            <TextInput
              id="firstName"
              label={i18n._(t`First Name`)}
              placeHolder="First Name"
              css={{ pointerEvents: 'none' }}
            />
          </View>
          <View paddingLeft={1} flexShrink={1} flexGrow={1} width="50%">
            <TextInput
              id="lastName"
              label={i18n._(t`Last Name`)}
              autoComplete="new-password"
              placeHolder="Last Name"
              css={{ pointerEvents: 'none' }}
            />
          </View>
        </View>

        <View width="100%">
          <TextInput id="Email" placeHolder="Email" autoComplete="new-password" css={{ pointerEvents: 'none' }} />
        </View>
        <View marginY={3} width="100%">
          <TextInput
            id="Password"
            placeHolder="Password"
            autoComplete="new-password"
            css={{ pointerEvents: 'none' }}
            suffixNode={
              <View padding={4}>
                <IconEye color={foundations.colors.accent} />
              </View>
            }
          />
        </View>
      </View>
    )}
  </I18n>
);

export default SignupForm;
