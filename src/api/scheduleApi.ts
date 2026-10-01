import axiosInstance from '@/api/axiosInstance';
import type { RawScheduleContent } from '@/types/bookmark';
import type { DRFPage } from '@/types/idol';
import type { IdolSchedule, Schedule } from '@/types/schedule';

type ScheduleResponse = Partial<Omit<RawScheduleContent, 'idol'>> & {
  idol?: number | { id?: number; name?: string };
  idol_name?: string;
  startTime?: string;
  start_at?: string;
  startAt?: string;
  endTime?: string;
  end_at?: string;
  endAt?: string;
  isPublic?: boolean;
  place?: string;
};

type ScheduleListResponse = ScheduleResponse[] | DRFPage<ScheduleResponse>;

const pickList = (data: ScheduleListResponse): ScheduleResponse[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const baseFields = (raw: ScheduleResponse) => {
  const start =
    raw?.start_time ?? raw?.startTime ?? raw?.start_at ?? raw?.startAt ?? '';
  const end = raw?.end_time ?? raw?.endTime ?? raw?.end_at ?? raw?.endAt ?? '';

  return {
    id: Number(raw?.id ?? Math.random()),
    title: String(raw?.title ?? ''),
    startTime: String(start),
    endTime: String(end),
    description: raw?.description ? String(raw.description) : '',
    isPublic: Boolean(raw?.is_public ?? raw?.isPublic ?? true),
    place: raw?.place ? String(raw.place) : undefined,
    location: raw?.location ? String(raw.location) : undefined,
  };
};

const toIdolSchedule = (raw: ScheduleResponse): IdolSchedule => {
  const base = baseFields(raw);

  let idolId = -1;
  if (typeof raw?.idol === 'number') {
    idolId = raw.idol;
  } else if (
    typeof raw?.idol === 'object' &&
    typeof raw.idol?.id === 'number'
  ) {
    idolId = raw.idol.id;
  }

  let idolName = '';
  if (typeof raw?.idol_name === 'string') {
    idolName = raw.idol_name;
  } else if (
    typeof raw?.idol === 'object' &&
    typeof raw.idol?.name === 'string'
  ) {
    idolName = raw.idol.name;
  }

  return {
    ...base,
    idol: {
      id: Number(idolId),
      name: idolName,
    },
  };
};

export async function fetchIdolSchedules(
  idolId?: number | string,
  dateISO?: string,
): Promise<Schedule[]> {
  const params: Record<string, number | string> = {};
  if (idolId !== undefined && idolId !== null) params.idol = idolId;
  if (dateISO) params.date = dateISO;

  const res = await axiosInstance.get<ScheduleListResponse>(
    '/schedules/idols/',
    { params },
  );
  const list = pickList(res.data);
  return list.map(toIdolSchedule);
}

export async function fetchIdolSchedulesByDate(
  idolId: number | string,
  dateISO: string,
): Promise<Schedule[]> {
  const res = await axiosInstance.get<ScheduleListResponse>(
    '/schedules/idols/',
    {
      params: { idol: idolId, date: dateISO },
    },
  );
  const list = pickList(res.data);
  return list.map(toIdolSchedule);
}
