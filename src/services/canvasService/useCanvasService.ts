import { useMemo, useState, useEffect } from 'react'
import CanvasService, { CanvasIntegrationDetails } from '@src/services/canvasService';

type useCanvasServiceOptions = {
  portalId: string
  portalName: string
}
type UpdateSettingReponse = {
  isError?: boolean
  message: string
  redirectUrl?: string
}
export const useCanvasService = ({ portalId, portalName }: useCanvasServiceOptions) => {
  const canvasService = useMemo(() => CanvasService(), [])

  const [connection, setConnection] = useState<CanvasIntegrationDetails>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    canvasService
      .getConfig(portalId)
      .then(data => {
        const currentConnection = data[0]
        console.log(currentConnection)
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
  }, [portalId])

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
