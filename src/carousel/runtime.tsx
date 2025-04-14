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
  useSlots: boolean;
}

const defaultImg = 'data:image/png;base64,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'

export default ({ env, data, slots }: RuntimeParams<Data>) => {
  const { edit } = env;
  const { items, dotsStyle } = data;
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const [useSlots, setUseSlots] = useState(data.useSlots ?? true);

  useEffect(() => {
    if (carouselRef.current && edit) {
      carouselRef.current.goTo(data.slideIndex);
    }
  }, [data.slideIndex]);

  useEffect(()=>{
    setUseSlots(data.useSlots ?? true)
  },[data.useSlots])

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
        {/* 开启了插槽的情况 */}
        {useSlots && items.map((item, index) => {
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
        {/* 未开启插槽的情况 */}
        {!useSlots && items.map((item, index) => {
            return (
              <img src={item.url || defaultImg} className={styles.img_item} key={index}/>
            )
        })}
      </Carousel>
    </div>
  );
};
