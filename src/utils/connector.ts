import { useRef, useEffect } from "react";

export const ConnectorFiledName = "_connector";

export const useConnector = ({ env, data, filedName = ConnectorFiledName }, callback) => {
  const stateRef = useRef({
    init: false,
    stop: false,
  });

  const connector = data[filedName];

  useEffect(() => {
    if (connector && !stateRef.current.stop) {
      callback(new Promise((resolve, reject) => {
        env.callConnector(
          connector.connector,
          {},
          { 
            outputSchema: connector.outputSchema,
            isMultipleOutputs: false,
          },
        ).then((res) => {
          if (!stateRef.current.stop) {
            resolve(res);
          }
        }).catch((err) => {
          if (!stateRef.current.stop) {
            reject(err);
          }
        })
      }), stateRef.current);
    }
  }, [connector])

  return [connector, stateRef.current];
}

export const connectorEditor = <T>(params: {
  fieldName?: string;
  set?: (params: any, result: { schema: any }) => void;
  remove?: (params: any) => void;
} = {}) => {
  const { fieldName = ConnectorFiledName, set, remove } = params;
  return {
    "@domainModel": {
      get: ({ data }) => {
        return data[fieldName]?.connector;
      },
      async set(params, connector) {
        const outputSchema = connector.markList?.[0]?.outputSchema;

        params.data[fieldName] = {
          // globalMock: connector.globalMock
          outputSchema,
          connector: {
            id: connector.id,
            title: connector.title,
            type: connector.type,
            connectorName: connector.connectorName,
            script: connector.script
          }
        }

        set?.(params as T, { schema: outputSchema });
      },
      remove(params) {
        params.data[fieldName] = null;
        Reflect.deleteProperty(params.data, fieldName);
        remove?.(params as T);
      }
    }
  }
}
