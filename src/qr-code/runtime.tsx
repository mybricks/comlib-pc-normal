import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import { Data } from './constants';
export default (props: RuntimeParams<Data>) => {
  const { inputs, data, outputs } = props;
  const { link, size, renderAs, icon, hasIcon } = data;
  const qrRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    inputs['link']((value: string, relOutputs) => {
      data.link = value;
      relOutputs['setLinkComplete']()
    });

    inputs['download'] && inputs['download'](downloadQR);
  }, []);

  const onClick = () => {
    outputs['click'](data.link);
    setCount((pre) => pre + 1);
  };

  const toImageData = () => {
    const qr = qrRef.current?.children[0] as HTMLCanvasElement;
    if (data.renderAs === 'canvas') {
      return qr.toDataURL('image/png');
    } else {
      const svg = new XMLSerializer().serializeToString(qr);
      return `data:image/svg+xml;base64,${window.btoa(svg)}`;
    }
  };

  const downloadQR = (_, relOutputs) => {
    const imageData = toImageData();
    // const image = new Image();
    // image.crossOrigin = "anonymous";
    // image.src = imageData;
    const downLink = document.createElement('a');
    downLink.href = imageData;
    downLink.download = '二维码';
    downLink.click();
    relOutputs['downloadComplete']()
  };

  return (
    <div ref={qrRef} className="root" style={{ width: '100%', height: '100%' }} onClick={onClick}>
      {!!data.link ? (
        <QRCode
          style={{ width: '100%', height: '100%' }}
          value={link}
          size={size}
          renderAs={renderAs}
          imageSettings={
            icon?.url && hasIcon
              ? {
                  src: icon.url,
                  width: parseFloat(icon.width),
                  height: parseFloat(icon.height),
                  excavate: true
                }
              : void 0
          }
        />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#555',
            color: '#fff'
          }}
        >
          请先在左侧填写链接
        </div>
      )}
    </div>
  );
};
