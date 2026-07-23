import { audienceLandings } from '@/data/audiences'
import { AudienceLandingView } from '@components/collections/AudienceLandingView'

export default function MenPage() {
  return <AudienceLandingView landing={audienceLandings.men} />
}
