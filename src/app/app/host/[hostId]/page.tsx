import EventViewDrawer from '@/components/app/EventViewDrawer';
import InfoViewSheet from '@/components/app/InfoViewSheet';
import ListenViewSheet from '@/components/app/ListenViewSheet';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getEventsByIds, getHostProfileById, getMediaById } from '@/lib/actions';
import Image from 'next/image';
import { Suspense } from 'react';

type HostPageParams = {
  params: {
    hostId: string;
  };
};

export default async function HostPage({ params }: HostPageParams) {
  const hostProfile = await getHostProfileById(params.hostId);
  const events = await getEventsByIds(hostProfile.events);
  let media;
  if (hostProfile.mediaId) {
    media = await getMediaById(hostProfile.mediaId);
  }

  if (!hostProfile || !events) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full mx-auto w-full items-center">
      <div className="flex w-full justify-evenly flex-1 items-center">
        <div className="flex flex-col w-auto">
          <p className="text-8xl max-w-xl">{hostProfile.name}</p>
        </div>
        <div className="w-[500px] max-h-[700px]">
          <AspectRatio ratio={9 / 12}>
            <Image
              src={media ? media.url : '/placeholder.png'}
              alt={hostProfile.name}
              fill
              className="object-contain"
            />
          </AspectRatio>
        </div>
      </div>
      <div className="flex pb-16 justify-evenly w-full">
        <InfoViewSheet hostProfile={hostProfile} label="More Info" />
        <Suspense fallback={null}>
          <EventViewDrawer hostProfile={hostProfile} events={events} label="Upcoming Events" />
        </Suspense>
        <ListenViewSheet hostProfile={hostProfile} label={`Listen to ${hostProfile.name}`} />
      </div>
    </div>
  );
}