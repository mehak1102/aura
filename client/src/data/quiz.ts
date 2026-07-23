import { ROUTES } from '@/routes/paths'
import type { ConcernSlug } from '@/data/concerns'

export type QuizOption = {
  id: string
  label: string
  concern?: ConcernSlug
  tags?: string[]
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
}

export const skinQuiz: {
  title: string
  subtitle: string
  questions: QuizQuestion[]
} = {
  title: 'Find your ritual',
  subtitle: 'Three quiet questions — then a botanical path made for you.',
  questions: [
    {
      id: 'focus',
      prompt: 'What do you want to calm first?',
      options: [
        { id: 'acne', label: 'Breakouts & congestion', concern: 'acne' },
        { id: 'oil', label: 'Shine & oily T-zone', concern: 'oily-skin' },
        { id: 'pigment', label: 'Uneven tone', concern: 'pigmentation' },
        { id: 'dry', label: 'Tightness & dryness', concern: 'dryness' },
        { id: 'hair', label: 'Hair fall / scalp', concern: 'hairfall' },
        { id: 'sensitive', label: 'Redness & sensitivity', concern: 'sensitive-skin' },
      ],
    },
    {
      id: 'texture',
      prompt: 'How does your skin usually feel by afternoon?',
      options: [
        { id: 'tight', label: 'Tight or flaky', tags: ['dryness'], concern: 'dryness' },
        { id: 'balanced', label: 'Mostly balanced', tags: ['dullness'], concern: 'dullness' },
        { id: 'shiny', label: 'Shiny or congested', tags: ['acne'], concern: 'oily-skin' },
        { id: 'reactive', label: 'Reactive or warm', tags: ['sensitivity'], concern: 'sensitive-skin' },
      ],
    },
    {
      id: 'ritual',
      prompt: 'How long is your ideal ritual?',
      options: [
        { id: 'quick', label: 'Under 3 minutes', tags: ['simple'] },
        { id: 'daily', label: 'A calm 5–7 minutes', tags: ['daily'] },
        { id: 'weekly', label: 'I love a weekly oil night', tags: ['oils'] },
      ],
    },
  ],
}

export function quizResultPath(concern: ConcernSlug) {
  return `${ROUTES.concerns}/${concern}`
}
