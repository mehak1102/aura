import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { reviews } from '@/data/home'
import { useGsap, revealOnScroll, prefersReducedMotion } from '@animations/gsap'
import { useInView } from '@hooks/useInView'
import { cn } from '@utils/index'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

function GoldLeaf({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn('h-3.5 w-3.5 text-[#C8A96A]', className)}
      fill="none"
    >
      <path
        d="M12 20 C8 16 5 11 6 6 C10 7 13 11 14 15 C15 11 18 7 22 6 C21 12 17 17 12 20 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M12 20 V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function FlourishRule({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)} aria-hidden>
      <span className="h-px w-10 bg-[#C8A96A]/75 sm:w-14" />
      <GoldLeaf />
      <span className="h-px w-10 bg-[#C8A96A]/75 sm:w-14" />
    </div>
  )
}

function LeafBranch({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 500 900"
      fill="none"
      className={cn('pointer-events-none absolute text-[#8b9a7f]', className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill="currentColor" stroke="none" opacity="0.32">
        <path
          d="M340 0 C320 80, 280 160, 240 240 C210 300, 180 360, 155 430 C130 500, 115 570, 105 650 C100 710, 98 770, 100 860"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path d="M340 20 C355 35, 360 60, 345 75 C330 60, 325 35, 340 20Z" />
        <path d="M320 70 C300 60, 280 65, 275 85 C290 90, 310 85, 320 70Z" />
        <path d="M300 120 C320 115, 340 125, 340 145 C320 145, 300 135, 300 120Z" />
        <path d="M280 170 C260 155, 240 158, 235 178 C250 185, 270 180, 280 170Z" />
        <path d="M265 220 C285 215, 305 225, 300 245 C280 243, 262 235, 265 220Z" />
        <path d="M245 270 C225 255, 205 260, 200 280 C218 288, 238 282, 245 270Z" />
        <path d="M225 320 C245 318, 260 330, 255 348 C238 345, 222 335, 225 320Z" />
        <path d="M200 370 C180 358, 160 362, 158 382 C175 388, 194 382, 200 370Z" />
        <path d="M180 420 C198 418, 210 430, 205 448 C188 445, 177 432, 180 420Z" />
        <path d="M155 470 C138 458, 120 462, 118 480 C134 486, 150 480, 155 470Z" />
        <path d="M140 530 C158 528, 170 540, 165 556 C148 553, 137 542, 140 530Z" />
        <path d="M125 590 C108 580, 92 584, 90 600 C106 606, 120 600, 125 590Z" />
        <path d="M115 650 C130 648, 142 658, 138 674 C122 670, 112 660, 115 650Z" />
        <path d="M108 720 C95 710, 80 714, 78 730 C92 736, 105 730, 108 720Z" />
        <path d="M105 790 C118 788, 128 798, 124 812 C110 808, 102 798, 105 790Z" />
      </g>
    </svg>
  )
}

function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 24"
      className={cn('h-5 w-6 text-[#C8A96A]', className)}
      fill="currentColor"
    >
      <path d="M0 24 V10.5 C0 4.5 3.2 0.8 9 0 v4.2 C6.2 4.8 4.8 6.8 4.8 10.2 H9 V24 H0 Z M16 24 V10.5 C16 4.5 19.2 0.8 25 0 v4.2 C22.2 4.8 20.8 6.8 20.8 10.2 H25 V24 H16 Z" />
    </svg>
  )
}

export function HomeReviews() {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const reduced = prefersReducedMotion()
  const [cardsIn, setCardsIn] = useState(false)

  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal-header]'), {
      y: 22,
      stagger: 0.08,
      duration: 0.55,
    })
  }, [])

  const inView = useInView(scope, { threshold: 0.28 })

  useEffect(() => {
    if (inView) setCardsIn(true)
  }, [inView])

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper?.autoplay || reduced) return
    if (inView) swiper.autoplay.start()
    else swiper.autoplay.stop()
  }, [inView, reduced])

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-[#F3EBDD] py-[calc(5.25rem+14px)] sm:py-[calc(6.5rem+14px)] lg:py-[calc(7.5rem+14px)]"
    >
      <LeafBranch className="-left-6 top-0 h-[min(95%,42rem)] w-[min(48vw,22rem)]" />
      <LeafBranch className="-right-8 top-8 h-[min(90%,38rem)] w-[min(42vw,20rem)] scale-x-[-1]" />

      <div className="container-aura relative z-10">
        <header className="mx-auto max-w-2xl text-center">
          <div
            data-reveal-header=""
            className="flex items-center justify-center gap-2.5 sm:gap-3"
          >
            <span aria-hidden className="h-px w-8 bg-[#C8A96A]/75 sm:w-12" />
            <GoldLeaf />
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#C8A96A]">
              Customer Reviews
            </p>
            <GoldLeaf />
            <span aria-hidden className="h-px w-8 bg-[#C8A96A]/75 sm:w-12" />
          </div>
          <h2
            data-reveal-header=""
            className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-[#243528]"
          >
            Voices from the circle
          </h2>
          <p
            data-reveal-header=""
            className="mt-3 text-[0.92rem] leading-relaxed text-[#6f6558]"
          >
            Real stories. Real results. Real people.
          </p>
          <div data-reveal-header="" className="mt-4">
            <FlourishRule />
          </div>
        </header>

        <div className="relative mt-[5.25rem] sm:mt-[6.5rem] md:px-14 lg:px-16">
          <button
            type="button"
            aria-label="Previous reviews"
            className="reviews-prev absolute left-0 top-[calc(50%+1.25rem)] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A96A]/55 bg-[#FBF7F0] text-[#6f6558] shadow-[0_6px_16px_rgba(36,53,40,0.06)] transition hover:border-[#C8A96A] hover:text-[#243528] md:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            className="reviews-next absolute right-0 top-[calc(50%+1.25rem)] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A96A]/55 bg-[#FBF7F0] text-[#6f6558] shadow-[0_6px_16px_rgba(36,53,40,0.06)] transition hover:border-[#C8A96A] hover:text-[#243528] md:inline-flex"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={22}
            slidesPerView={1}
            loop={reviews.length >= 6}
            loopAdditionalSlides={2}
            centeredSlides={false}
            speed={700}
            navigation={{
              prevEl: '.reviews-prev',
              nextEl: '.reviews-next',
            }}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              if (!inView || reduced) swiper.autoplay?.stop()
            }}
            autoplay={
              reduced
                ? false
                : {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
            }
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 22 },
              1100: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="reviews-swiper !pb-12"
          >
            {reviews.map((review, i) => (
              <SwiperSlide key={review.name} className="!h-auto pt-10">
                <blockquote
                  className={cn(
                    'relative flex h-full min-h-[17.5rem] flex-col rounded-2xl border border-[#C8A96A] bg-[#FBF7F0] px-6 pb-7 pt-12 text-center shadow-[0_10px_28px_rgba(36,53,40,0.05)] sm:px-7',
                    !reduced && !cardsIn && 'opacity-0 translate-y-10',
                    !reduced && cardsIn && 'reviews-card-enter',
                  )}
                  style={
                    !reduced && cardsIn
                      ? { animationDelay: `${i * 160}ms` }
                      : undefined
                  }
                >
                  <div className="absolute left-1/2 top-0 z-10 flex h-[4.75rem] w-[4.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-[#C8A96A] bg-[#FBF7F0] shadow-[0_6px_16px_rgba(36,53,40,0.1)]">
                    <img
                      src={review.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full scale-110 object-cover"
                    />
                  </div>

                  <div className="mb-4 flex items-start justify-between">
                    <QuoteMark />
                    <div className="flex gap-0.5 text-[#C8A96A]">
                      {Array.from({ length: review.rating }).map((_, star) => (
                        <Star key={star} className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                      ))}
                    </div>
                  </div>

                  <p className="flex-1 font-display text-[0.98rem] leading-relaxed text-[#4f4a44] italic sm:text-[1.02rem]">
                    {review.text}
                  </p>

                  <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-[#C8A96A]/55" />

                  <footer className="mt-4">
                    <cite className="not-italic text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#243528]">
                      {review.name}
                    </cite>
                    <p className="mt-1.5 text-[0.8rem] text-[#6f6558]">{review.product}</p>
                  </footer>
                </blockquote>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .reviews-swiper .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          background: #d7c3a3;
          opacity: 1;
        }
        .reviews-swiper .swiper-pagination-bullet-active {
          background: #243528;
        }
        @keyframes reviews-card-enter {
          from {
            opacity: 0;
            transform: translateY(2.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reviews-card-enter {
          animation: reviews-card-enter 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </section>
  )
}
