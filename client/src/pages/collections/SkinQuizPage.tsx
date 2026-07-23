import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@components/seo/Seo'
import { Body, Display, Eyebrow } from '@components/ui'
import { skinQuiz, quizResultPath } from '@/data/quiz'
import type { ConcernSlug } from '@/data/concerns'
import { ROUTES } from '@/routes/paths'
import { cn } from '@utils/index'

export default function SkinQuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const question = skinQuiz.questions[step]
  const done = step >= skinQuiz.questions.length

  const resultConcern = useMemo((): ConcernSlug => {
    const focus = answers.focus as ConcernSlug | undefined
    if (focus) return focus
    const texture = skinQuiz.questions[1]?.options.find((o) => o.id === answers.texture)
    return texture?.concern ?? 'dullness'
  }, [answers])

  const select = (optionId: string) => {
    if (!question) return
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
    setStep((s) => s + 1)
  }

  return (
    <>
      <Seo title="Skin quiz" description={skinQuiz.subtitle} />
      <main className="flex min-h-[80vh] flex-col justify-center bg-[#f3efe6] px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-xl">
          <Eyebrow tone="gold">Skin quiz</Eyebrow>
          <Display as="h1" size="md" className="mt-3 text-forest">
            {skinQuiz.title}
          </Display>
          <Body muted className="mt-3">
            {skinQuiz.subtitle}
          </Body>

          {!done && question && (
            <div className="mt-12">
              <div className="mb-6 flex gap-2">
                {skinQuiz.questions.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      i <= step ? 'bg-[#b8975c]' : 'bg-charcoal/10',
                    )}
                  />
                ))}
              </div>
              <h2 className="font-display text-2xl text-forest md:text-3xl">
                {question.prompt}
              </h2>
              <div className="mt-8 space-y-3">
                {question.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => select(opt.id)}
                    className="w-full border border-charcoal/15 bg-cream px-5 py-4 text-left text-sm transition-colors hover:border-forest hover:bg-warm-white"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {done && (
            <div className="mt-12 border border-charcoal/10 bg-cream p-8 md:p-10">
              <Eyebrow>Your path</Eyebrow>
              <Display as="h2" size="sm" className="mt-3 text-forest">
                We’d start with {resultConcern.replace(/-/g, ' ')}
              </Display>
              <Body muted className="mt-4">
                Based on your answers, here’s a concern page with products, a routine, and reading
                matched to you.
              </Body>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={quizResultPath(resultConcern)}
                  className="inline-flex bg-forest px-6 py-3 text-[0.7rem] tracking-[0.16em] uppercase text-warm-white"
                >
                  See my ritual
                </Link>
                <Link
                  to={ROUTES.shop}
                  className="inline-flex items-center px-4 text-micro tracking-[0.14em] uppercase text-olive"
                >
                  Browse shop
                </Link>
              </div>
              <button
                type="button"
                className="mt-8 text-micro text-charcoal/50 underline"
                onClick={() => {
                  setStep(0)
                  setAnswers({})
                }}
              >
                Retake quiz
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
