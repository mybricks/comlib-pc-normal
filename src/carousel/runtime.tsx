import { Carousel } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './runtime.less';
import { DotPosition } from 'antd/lib/carousel';

export interface Data {
  items: any[];
  autoplay: boolean;
  autoplaySpeed: number;
  dotPosition: DotPosition;
  dotsStyle: any;
  slideIndex: number;
  bgSize: string;
}

export default ({ env, data, slots }: RuntimeParams<Data>) => {
  const { edit } = env;
  const { items, dotsStyle } = data;
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current && edit) {
      carouselRef.current.goTo(data.slideIndex);
    }
  }, [data.slideIndex]);

  return (
    <div className={styles.carouselWrapper}>
      {items.length <= 0 && edit && <div className={styles.empty}>请先在右侧添加轮播项</div>}
      <Carousel
        ref={(node) => (carouselRef.current = node)}
        autoplay={edit ? false : data.autoplay}
        autoplaySpeed={data.autoplaySpeed}
        dotPosition={data.dotPosition}
        infinite={edit ? false : true}
        customPaging={(i) => {
          // console.log('activeSlide', activeSlide, activeSlide === i ? 'bule' : '#fff')
          return (
            <button
              style={{
                height: dotsStyle?.height || '2px',
                background: dotsStyle?.background
              }}
            >
              {i + 1}
            </button>
          );
        }}
        beforeChange={(current, next) => {
          setActiveSlide(next);
        }}
      >
        {items.map((item, index) => {
          return (
            <div className={styles.item} key={index}>
              {item.url ? (
                <div className={styles.bg} style={{ ...item.bgColor }}>
                  <div
                    className={styles.itemSlotContainer}
                    style={{
                      background: `url(${item.url}) no-repeat center center`,
                      backgroundSize: item.bgSize || 'contain',
                      backgroundColor: item.bgColor?.background
                    }}
                  >
                    {item.slotId && slots[item.slotId].render()}
                  </div>
                </div>
              ) : (
                <div className={styles.empty}>{item.slotId && slots[item.slotId].render()}</div>
              )}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};
