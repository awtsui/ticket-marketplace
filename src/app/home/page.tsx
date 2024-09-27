import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="w-screen h-full fixed">
      <Image src="/landingbg.jpg" alt="landing-bg" fill className="object-cover" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p>{process.env.NEXT_PUBLIC_URL}</p>
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="w-auto text-7xl text-center max-w-[500px]">EXPLORE THE MARKETPLACE FOR HUMANS</p>
          <Button data-testid="explore-button" className="px-12 py-5 text-lg">
            <a href={`//app.${process.env.NEXT_PUBLIC_URL}`}>Explore</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
