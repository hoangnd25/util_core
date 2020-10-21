import * as React from 'react';
import { CurrentSessionType } from '@src/types/user';
import { SIDEBAR_MENUS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import WithIntegrations from '@src/components/common/WithIntegrations';
import { Spinner, View, Text, Link, Form, Field, TextInput, SubmitButton, Button, Banner, ButtonFilled, NotificationManager } from '@go1d/go1d';
import { useCanvasService } from '@src/services/canvasService/useCanvasService';
import { CanvasIntegrationDetails } from '@src/services/canvasService';

type CanvasLMSPageProps = {
  currentSession: CurrentSessionType
  router: any
}

export const CanvasLMSPage: React.FC<CanvasLMSPageProps> = ({
  currentSession: { portal: { id, title }}
}) => {
  const {
    connection, isLoading, error,
    connectCanvasConnection,
    updateCanvasConnection,
    deleteCanvasConnection
  } = useCanvasService({ portalId: id, portalName: title })

  const onConnectHandle = async (values, actions) => {
    const { isError, message, redirectUrl } = await connectCanvasConnection(values)
    actions.setSubmitting(false)
    notify(isError ? 'danger' : 'success', message)
    if(redirectUrl) window.location.assign(redirectUrl)
  }
  const onUpdateHandle = async (values, actions) => {
    const { isError, message, redirectUrl } = await updateCanvasConnection(values)
    actions.setSubmitting(false)
    notify(isError ? 'danger' : 'success', message)
    if(redirectUrl) window.location.assign(redirectUrl)
  }
  const onDisconnectHandle = async () => {
    const { isError, message } = await deleteCanvasConnection()
    notify(isError ? 'danger' : 'success', message)
  }

  const onFormSubmitHandle = !connection ? onConnectHandle : onUpdateHandle

  if (isLoading) {
    return (
      <View minHeight="60vh" justifyContent="center" alignItems="center">
        <Spinner size={3} />
      </View>
    )
  }

  return (
    <View className='View-canvas'>
      {error && (
        <Banner type='danger'>
          <Text>{error.message}</Text>
        </Banner>
      )}
      <View alignItems="flex-start" paddingTop={4}>
        <Text>
          First you will need to set up an account developer key with Canvas. To do that,{' '}
          <Link href='https://community.canvaslms.com/docs/DOC-12648'>
            <Text color='accent'>follow these instructions.</Text>
          </Link>
        </Text>
      </View>
      <View alignItems="flex-start" paddingTop={4} paddingBottom={6}>
        <Text>
          Please use{' '}
          <Text fontWeight="bold">https://api.go1.co/sso</Text>{' '}
          as the redirect URL when setting up the developer account and paste the required information into the fields below when available.
        </Text>
      </View>
      <Form
        initialValues={{
          domain: connection?.domain ?? '',
          client_id: connection?.client_id ?? '',
          client_secret: connection?.client_secret ?? '',
        }}
        validate={(values: CanvasIntegrationDetails) => {
          let errors: any = {}
          
          if(!values.domain) errors.domain = ' '
          if(!values.client_id) errors.client_id = ' '
          if(!values.client_secret) errors.client_secret = ' '

          return errors
        }}
        onSubmit={onFormSubmitHandle}
      >
        <View paddingBottom={4}>
          <Field component={TextInput} label='Domain / Environment' name='domain' required />
        </View>
        <View paddingBottom={4}>
          <Field component={TextInput} label='Client Id' name='client_id' required />
        </View>
        <View paddingBottom={4}>
          <Field component={TextInput} label='Client Secret' name='client_secret' required />
        </View>
        <div style={{ display: 'inline-flex' }}>
          <SubmitButton>
            {connection?.connected ? 'Update' : 'Connect'}
          </SubmitButton>
          {connection?.connected && (
            <ButtonFilled color='danger' marginLeft={4} onClick={onDisconnectHandle}>
              Disconnect
            </ButtonFilled>
          )}
        </div>
      </Form>
    </View>
  )
}

export default withAuth(WithIntegrations(CanvasLMSPage, { active: SIDEBAR_MENUS.CANVAS_LMS }))

const notify = (type: 'success' | 'danger', message: string) => {
  if(type === 'success') {
    NotificationManager.success({
      message,
      options: { lifetime: 3000, isOpen: true },
    })
  }
  else if(type === 'danger') {
    NotificationManager.danger({
      message,
      options: { lifetime: 3000, isOpen: true },
    })
  }
}