import React, { useState, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { FreeMode, Navigation, Thumbs, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper'
import { Data } from './constants'
import Style from './style.less';

export const ThumbsSwiper = (data: Data) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
    const prevRef = useRef<HTMLDivElement>(null)
    const nextRef = useRef<HTMLDivElement>(null)
    // 处理 autoplay（避免 boolean 直接传）
    const autoplayConfig = useMemo(() => {
        if (!data.autoplay) return false
        return {
            delay: 3000,
            disableOnInteraction: false,
        }
    }, [data.autoplay])

    // 防止 swiper 被销毁时报错
    const safeThumbsSwiper = thumbsSwiper && !thumbsSwiper.destroyed
        ? thumbsSwiper
        : null

    const renderSlides = () =>
        data.items.map((item) => (
            <SwiperSlide className={Style.swiperItem} key={item.id}>
                <img src={item.url} />
            </SwiperSlide>
        ))

    return (
        <div className={Style.box}>
            {/* 主图 */}
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                } as React.CSSProperties}
                speed={data.speed}
                loop={data.loop}
                autoplay={autoplayConfig}
                spaceBetween={data.spaceBetween}
                navigation
                thumbs={{ swiper: safeThumbsSwiper }}
                modules={[Thumbs, Autoplay]}
                className={Style.myThumbsSwiperMain}
            >
                {renderSlides()}
            </Swiper>

            {/* 缩略图 */}
            <div className={Style.thumbWrapper}>
                <div className={Style.thumbNavPrev} ref={prevRef}>
                </div>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={false}
                    spaceBetween={5}
                    slidesPerView={data.slidesPerView}
                    freeMode
                    watchSlidesProgress
                    className={Style.myThumbsSwiper}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        setTimeout(() => {
                            // 👇 关键：手动绑定 DOM
                            if (typeof swiper.params.navigation !== 'boolean') {
                                swiper.params.navigation!.prevEl = prevRef.current
                                swiper.params.navigation!.nextEl = nextRef.current
                                swiper.navigation.init()
                                swiper.navigation.update()
                            }
                        })

                    }}
                    modules={[FreeMode, Navigation, Thumbs]}
                >
                    {renderSlides()}
                </Swiper>
                <div className={Style.thumbNavNext} ref={nextRef}>
                </div>
            </div>

        </div>
    )
}

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
