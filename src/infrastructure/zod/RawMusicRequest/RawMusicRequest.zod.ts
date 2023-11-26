import z from "zod";
import { MusicRequestMediaSource } from "../../core/MusicRequestMediaSource";

const TimeZod = z.string().refine((payload) => payload.match(/^\d{1,2}:\d{1,2}$/) !== null);

export const RawMusicRequestZod = z.object({
  studentName: z.string(),

  url: z
    .string()
    .url()
    .refine((payload) => MusicRequestMediaSource.isValidURL(payload)),

  startTime: TimeZod.default("00:00"),

  endTime: TimeZod.nullable().optional().default(null),
});
