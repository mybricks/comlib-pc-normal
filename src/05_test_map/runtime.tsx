import React, { useCallback, useEffect, useState } from 'react';
// import styles from "./runtime.less";
import { dataType, langType, sourceType, StatisticAreaMap } from 'ibuilding-map';
// import ChartLayout from "../../components/chartLayout";

export default function ({ env, data, outputs, inputs }) {
  const [zoom, setZoom] = useState(0);
  const [pointList, setPointList] = useState<dataType[]>([
    {
      position: [100, 30],
      pointColor: '#ff0000'
    },
    {
      position: [120, 30],
      pointColor: '#00ff00'
    }
  ]);
  useEffect(() => {
    if (env.runtime) {
      inputs['setDataSource']((val) => {
        setPointList(val);
      });
      inputs['setZoom']((val) => {
        setZoom(parseInt(val));
      });
    }
  }, []);

  return (
    <StatisticAreaMap
      theme={data.theme}
      lang={data.lang || 'zh'}
      source={data.source}
      data={pointList}
      // tipsFormatter={tipsFormatter}
      center={[100, 40]}
      zoom={zoom || data.zoom}
      onPointClick={(e) => {
        outputs.onPointClick?.(e);
      }}
      style={{ height: '100%' }}
      onZoomChange={(e) => {
        outputs.onZoomChange?.(e);
      }}
    />
  );
}
