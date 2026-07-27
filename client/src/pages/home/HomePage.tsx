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
  HomeCategories,
  HomeBestSellers,
  HomePhilosophy,
  HomeWhyUs,
  HomeTimeline,
  HomeIngredientShowcase,
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
      <HomeSplitJourney />

      <HomeIngredients />
      <HomeCategories />
      <HomeBestSellers />
      <HomePhilosophy />
      <HomeWhyUs />
      <HomeIngredientShowcase />
      <HomeTimeline />
      <HomeReviews />
      <HomeInstagram />
      <HomeNewsletter />
      <HomeManifesto />
    </>
  )
}
