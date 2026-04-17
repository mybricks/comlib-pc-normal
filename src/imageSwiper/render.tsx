import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

import { FreeMode, Navigation, Thumbs, Pagination,Autoplay } from 'swiper/modules';
import { Data } from './constants'
import Style from './style.less';

export const ThumbsSwiper = (data: Data) => {
        console.log('data', data)
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return (
        <div className={Style.box}>
            <Swiper style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
            }}
                speed={data.speed}
                 key={JSON.stringify({
                    speed: data.speed,
                    loop: data.loop,
                    autoplay: data.autoplay,
                    spaceBetween: data.spaceBetween,
                })}
                loop={data.loop}
                autoplay={data.autoplay}
                spaceBetween={data.spaceBetween}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                className={Style.myThumbsSwiperMain}
            >
                {
                    data.items.map((item, i) => {
                        return <SwiperSlide className={Style.swiperItem} key={item.id}> <img src={item.url} /></SwiperSlide>
                    })
                }
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                loop={data.loop}
                autoplay={data.autoplay}
                spaceBetween={5}
                slidesPerView={data.slidesPerView}
                freeMode={true}
                key={JSON.stringify({
                    speed: data.speed,
                    loop: data.loop,
                    autoplay: data.autoplay,
                    spaceBetween: data.spaceBetween,
                    position: 'pointer'
                })}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className={Style.myThumbsSwiper}
            >
                {
                    data.items.map((item, i) => {
                        return <SwiperSlide  className={Style.swiperItem}  key={item.id}> <img src={item.url} /></SwiperSlide>
                    })
                }
            </Swiper>
        </div>
    );
};

export const DotsSwiper = (data: Data) => {
    console.log('data', data)
    return (
        <div className={Style.box}>
            <Swiper
                key={JSON.stringify({
                    speed: data.speed,
                    loop: data.loop,
                    autoplay: data.autoplay,
                    spaceBetween: data.spaceBetween
                })}
                speed={data.speed}
                loop={data.loop}
                autoplay={data.autoplay}
                spaceBetween={data.spaceBetween}
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
            >
                {
                    data.items.map((item, i) => {
                        return <SwiperSlide className={Style.swiperItem} key={item.id}> <img src={item.url} /></SwiperSlide>
                    })
                }
            </Swiper>
        </div>
    );
};
