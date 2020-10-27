import { useState, useEffect } from 'react'
import CanvasService, { CanvasIntegrationDetails } from '@src/services/canvasService';

type useCanvasServiceOptions = {
  portalId: string
  portalName: string
  router: any
}
type UpdateSettingReponse = {
  isError?: boolean
  message: string
  redirectUrl?: string
}

export const canvasService = CanvasService()
export const useCanvasService = ({ portalId, portalName, router }: useCanvasServiceOptions) => {
  const [connection, setConnection] = useState<CanvasIntegrationDetails>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  

  const { error_code, session_id } = process.browser ? router?.query : {} as any
  useEffect(() => {
    if(error_code) return setError({
      sessionId: session_id,
      message: mapErrorMessage(error_code),
    })

    canvasService
      .getConfig(portalId)
      .then(data => {
        const currentConnection = data[0]
        if(currentConnection) {
          setConnection({
            connected: currentConnection.enabled === '1',
            connectionId: currentConnection.id,
            domain: currentConnection.configuration.domain,
            client_id: currentConnection.configuration.client_id,
            client_secret: currentConnection.configuration.client_secret,
          })
          setIsLoading(false)
        }
      })
      .catch(error => {
        setError(error)
        setIsLoading(false)
      })
  }, [error_code, session_id, portalId])

  const connectCanvasConnection = async (settings: CanvasIntegrationDetails): Promise<UpdateSettingReponse> => {
    if(!settings.domain
      || !settings.client_id
      || !settings.client_secret
    ) return { isError: true, message: 'Unable to begin authentication, please check settings.' }

    return canvasService
      .setConfig(portalId, portalName, settings)
      .then(({ redirectUrl }) => {
        setConnection({
          ...connection,
          connected: true,
        })
        return {
          message: 'Settings saved, beginning authorization ...',
          redirectUrl,
        }
      })
      .catch(() => ({ isError: true, message: 'Unable to save settings.' }))
  }
  
  const updateCanvasConnection = (settings: CanvasIntegrationDetails): Promise<UpdateSettingReponse> => {
    if(!settings.domain
      || !settings.client_id
      || !settings.client_secret
    ) return { isError: true, message: 'Problem updating connection, please check settings.' } as any

    return canvasService
      .updateConfig(
        portalId,
        portalName,
        connection.connectionId,
        settings
      )
      .then(({ redirectUrl }) => {
        setConnection({
          ...connection,
          connected: true,
        })
        return {
          message: 'Settings saved.', 
          redirectUrl,
        }
      })
      .catch(() => ({ isError: true, message: 'Unable to save settings.' }))
  }

  const deleteCanvasConnection = (): Promise<UpdateSettingReponse> => {
    return canvasService
      .deleteConfig(
        portalId,
        connection.connectionId, 
        {
          domain: connection.domain,
          client_id: connection.client_id,
          client_secret: connection.client_secret
        }
      )
      .then(() => {
        setConnection({
          ...connection,
          connected: false,
        })
        return { message: 'Connection deleted.' }
      })
      .catch(() => ({ isError: true, message: 'Unable to disable settings.' }))
  }

  return {
    connection, isLoading, error,
    connectCanvasConnection,
    updateCanvasConnection,
    deleteCanvasConnection,
  }
}

const mapErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'SSO:PortalNotFound':
      return 'Portal details could not be found. Please contact your Administrator to setup Single Sign On for your portal';
    case 'SSO:UnknownIdentityProvider':
      return 'The Identity Provider is currently not available. Please contact your Administrator.';
    case 'SSO:PermissionDenied':
      return 'Permission Denied. Your account does not have access. Please contact your Administrator.';
    case 'SSO:InternalServerError':
      return 'An unexpected error occurred. Please try again later.';
    case 'SSO:ProviderError':
      return 'Something went wrong. Please try connecting again.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
}