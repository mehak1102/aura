import { audienceLandings } from '@/data/audiences'
import { AudienceLandingView } from '@components/collections/AudienceLandingView'

export default function WomenPage() {
  return <AudienceLandingView landing={audienceLandings.women} />
}
