import { Seo } from '@components/seo/Seo'
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/seo'
import {
  HomeHero,
  HomeStory,
  HomeEditorialScroll,
  HomeFeaturedSplit,
  HomeConcerns,
  HomeSplitJourney,
  HomeExpectations,
  HomeIngredients,
  HomeBestSellers,
  HomePhilosophy,
  HomeWhyUs,
  HomeTimeline,
  HomeReviews,
  HomeInstagram,
  HomeNewsletter,
  HomeManifesto,
} from '@components/home'

export default function HomePage() {
  return (
    <>
      <Seo
        title="Pure · Natural · Nourishing"
        description="Aura of Nature — botanical rituals for skin, body, and hair. Handcrafted, transparent, Ayurvedic."
        jsonLd={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]}
      />
      <HomeHero />
      <HomeStory />
      <HomeEditorialScroll />
      <HomeFeaturedSplit />
      {/* <HomeConcerns /> */}
      <HomeExpectations />
      <HomeConcerns />
      <HomeBestSellers />
      <HomeSplitJourney />

      <HomeIngredients />
      <HomePhilosophy />
      <HomeWhyUs />
      <HomeTimeline />
      <HomeReviews />
      <HomeInstagram />
      <HomeNewsletter />
      <HomeManifesto />
    </>
  )
}
