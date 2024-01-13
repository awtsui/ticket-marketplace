import HostProfile from '@/lib/mongodb/models/HostProfile';
import { updateHostProfile } from '@/lib/mongodb/utils/hostprofiles';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { HostProfileDataRequestBodySchema } from '@/lib/zod/apischema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const hostId = searchParams.get('id');
    let data;
    if (hostId) {
      data = await HostProfile.findOne({ hostId });
    } else {
      data = await HostProfile.find({});
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/hosts/profiles): ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const validatedReqBody =
      HostProfileDataRequestBodySchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      throw Error('Invalid host profile data');
    }

    const resp = await updateHostProfile(validatedReqBody.data);

    if (!resp.success) {
      throw Error('Failed to update host profile');
    }

    return NextResponse.json(
      { message: 'Successfully updated host profile', hostId: resp.hostId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/hosts/profile): ${error}` },
      { status: 500 }
    );
  }
}