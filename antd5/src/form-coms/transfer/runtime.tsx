
                    import React, { useRef } from "react";
                    import { StyleProvider } from "@ant-design/cssinjs";
                    import Runtime from "../../../../src/form-coms/transfer/runtime.tsx";

                    export default function (props) {
                      const container = useRef((props.env.edit || props.env.runtime.debug) ? document.querySelector("#_mybricks-geo-webview_")!.shadowRoot : null);
                      return (
                        <StyleProvider container={container.current!} hashPriority="high">
                          <Runtime {...props} />
                        </StyleProvider>
                      )
                    }
                  