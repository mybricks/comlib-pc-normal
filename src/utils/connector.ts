import { useRef, useEffect } from "react";

export const useConnector = ({ env, connector }, callback) => {
  const stateRef = useRef({
    init: false,
    stop: false,
  });

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

  return stateRef.current;
}

export const connectorEditor = <T>(params: {
  fieldName: string;
  set?: (params: any, result: { schema: any }) => void;
  remove?: (params: any) => void;
}) => {
  const { fieldName, set, remove } = params;
  return {
    "@connector": {
      get: ({ data }) => {
        return data[fieldName]?.connector;
      },
      async set(params, connector) {
        const outputSchema = connector.markList[0].outputSchema;

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
        Reflect.deleteProperty(params.data, fieldName);
        remove?.(params as T);
      }
    }
  }
}
