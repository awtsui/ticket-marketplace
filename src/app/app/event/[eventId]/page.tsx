import { getEventById, getHostProfileByIds, getMediaById, getVenueById } from '@/lib/actions';
import Image from 'next/image';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { formatDate } from '@/lib/client/utils';
import GoogleMapView from '@/components/app/GoogleMapView';
import CopyToClipboard from '@/components/CopyToClipboard';
import AddTicketDialog from '@/components/app/AddTicketDialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Link from 'next/link';
import VerificationLevelIcon from '@/components/app/VerificationLevelIcon';

interface EventPageParams {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: EventPageParams) {
  const event = await getEventById(params.eventId);
  const hosts = await getHostProfileByIds(event.lineup);
  const venue = await getVenueById(event.venueId);
  const media = await getMediaById(event.mediaId);

  if (!event || !hosts || !venue || !media) {
    return <div>Loading...</div>;
  }

  const venueAddress = `${venue.address} ${venue.city}, ${venue.state} ${venue.zipcode}`;
  const [date, time] = formatDate(event.datetime).split(' at ');

  return (
    <div className="mx-auto w-3/5 pb-12">
      <AspectRatio ratio={20 / 8}>
        <Image
          src={media.url}
          alt={`event-banner-image-${event.eventId}`}
          fill
          style={{ objectFit: 'cover', borderRadius: '20px' }}
          className="rounded-lg"
        />
      </AspectRatio>
      <div className="flex pt-6 px-12 justify-center gap-5 md:gap-20 lg:gap-36">
        <div className="flex flex-col w-auto">
          <div className="pb-4 flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-4xl font-bold">{event.title}</p>
              <p className="text-xl">{event.subTitle}</p>
            </div>
            <div className="mt-1">
              <VerificationLevelIcon verificationLevel={event.verificationLevel} />
            </div>
          </div>
          <div className="py-4">
            <p className="text-md">{event.description}</p>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <p className="text-xl font-bold py-2">Information</p>
            <div className="flex gap-3 items-center">
              <User />
              <div className="flex gap-3">
                {hosts.map((host, index) => (
                  <div key={host.hostId} className="flex">
                    <Link href={`/host/${host.hostId}`}>
                      <p className="text-md hover:text-green-500">{host.name}</p>
                    </Link>
                    {index < hosts.length - 1 && <p>{', '}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <MapPin />
              <Link className="text-md hover:text-green-500" href={`/venue/${venue.venueId}`}>
                {venue.name}
              </Link>
            </div>
            <div className="flex gap-3 items-center">
              <Calendar />
              <p className="text-md">{date}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Clock />
              <p className="text-md">{time}</p>
            </div>
          </div>
          <div className="py-4">
            <AddTicketDialog event={event} />
          </div>
        </div>
        <div className="flex flex-col w-auto">
          <div className="py-2">
            <p className="text-xl font-bold py-2">Event location</p>
            <div className="py-2">
              <GoogleMapView address={venueAddress} />
            </div>
          </div>

          <div className="py-2">
            <p className="text-xl font-bold py-2">Address</p>
            <CopyToClipboard text={venueAddress}>
              <p className="text-md hover:text-green-500">
                {venue.address} {venue.city}, {venue.state}
              </p>
            </CopyToClipboard>
          </div>

          <div className="py-2">
            <p className="text-xl font-bold py-2">Parking</p>
            <ul>
              {venue.parking.map((instruction: any) => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
