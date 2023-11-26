import { differenceInSeconds, parse } from "date-fns";

export const parseStringTimeMark = (payload: any) => {
  if (typeof payload === "string") {
    const parsedDate = parse(payload, "m:s", new Date());

    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return null;
};

export const getDifferenceInSeconds = (startTimeMark: string, endTimeMark: string | null) => {
  if (typeof endTimeMark !== "string" || endTimeMark === "") {
    return 20;
  }

  const pStart = parseStringTimeMark(startTimeMark);
  const pEnd = parseStringTimeMark(endTimeMark);

  const realDiff = Math.abs(differenceInSeconds(pEnd, pStart));

  return Math.min(realDiff, 20);
};
