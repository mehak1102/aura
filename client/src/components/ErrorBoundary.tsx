import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallbackTitle?: string
}

type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
          <h1 className="font-display text-2xl text-forest">
            {this.props.fallbackTitle || 'Something went wrong'}
          </h1>
          <p className="max-w-md text-sm text-charcoal/65">
            Please refresh the page. If the problem continues, try again shortly.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-forest px-5 py-2.5 text-xs uppercase tracking-wider text-warm-white"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
