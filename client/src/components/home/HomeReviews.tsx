import { useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import { Body, Display, Eyebrow } from '@components/ui'
import { reviews } from '@/data/home'
import { useGsap, revealOnScroll, prefersReducedMotion } from '@animations/gsap'
import { useInView } from '@hooks/useInView'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

export function HomeReviews() {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const scope = useGsap(() => {
    if (!scope.current) return
    revealOnScroll(scope.current.querySelectorAll('[data-reveal]'))
  }, [])
  const inView = useInView(scope, { threshold: 0.25 })
  const reduced = prefersReducedMotion()

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper?.autoplay || reduced) return
    if (inView) swiper.autoplay.start()
    else swiper.autoplay.stop()
  }, [inView, reduced])

  return (
    <section ref={scope} className="section-aura bg-beige/30">
      <div className="container-aura">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow data-reveal="">Customer reviews</Eyebrow>
          <Display data-reveal="" as="h2" size="lg" className="mt-4 text-forest">
            Voices from the circle
          </Display>
        </div>

        <div data-reveal="" className="mt-14">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              if (!inView || reduced) swiper.autoplay?.stop()
            }}
            autoplay={
              reduced
                ? false
                : { delay: 4500, disableOnInteraction: false }
            }
            breakpoints={{
              768: { slidesPerView: 2 },
              1100: { slidesPerView: 3 },
            }}
            className="!pb-12"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.name}>
                <blockquote className="flex h-full flex-col border border-charcoal/10 bg-warm-white/70 p-8 backdrop-blur-sm">
                  <div className="flex gap-1 text-soft-gold">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <Body className="mt-5 flex-1 italic">“{review.text}”</Body>
                  <footer className="mt-8">
                    <p className="text-micro text-forest">{review.name}</p>
                    <p className="mt-1 text-sm text-charcoal-muted">{review.product}</p>
                  </footer>
                </blockquote>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
