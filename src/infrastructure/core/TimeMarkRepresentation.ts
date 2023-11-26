import { differenceInSeconds, parse } from "date-fns";
import { ITimeMarkRepresentationConstructor, ITimeMarkRepresentationInstance, ITimeMarkRepresentationState } from "../../domain";

export const TimeMarkRepresentation: ITimeMarkRepresentationConstructor = class TimeMarkRepresentation
  implements ITimeMarkRepresentationInstance
{
  #state: ITimeMarkRepresentationState = null;

  setStateFromDate(date: Date | null) {
    this.#state = TimeMarkRepresentation.parseStateFromDate(date);
  }

  setStateFromPayload(payload: any) {
    if (payload instanceof TimeMarkRepresentation) {
      this.#state = payload.asState();
    } else {
      this.setStateFromDate(TimeMarkRepresentation.parseDateFromPayload(payload));
    }
  }

  asString(fallback = true) {
    if (this.#state !== null) {
      const minute = this.#state.minute;
      const second = this.#state.second;

      return `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
    }

    if (fallback) {
      return "00:00";
    }

    return "";
  }

  asDate() {
    return TimeMarkRepresentation.parseDateFromState(this.#state);
  }

  asState() {
    return TimeMarkRepresentation.cloneState(this.#state);
  }

  hasState() {
    return this.#state !== null;
  }

  static cloneState(state: ITimeMarkRepresentationState): ITimeMarkRepresentationState {
    if (state !== null) {
      return {
        minute: state.minute,
        second: state.second,
      };
    }

    return null;
  }

  static fromPayload(payload: any) {
    const timeMarkRepresentation = new TimeMarkRepresentation();

    timeMarkRepresentation.setStateFromPayload(payload);

    return timeMarkRepresentation;
  }

  static parseDateFromPayload(payload: any): Date | null {
    if (typeof payload === "string") {
      const parsedDate = parse(payload, "m:s", new Date());

      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    if (payload instanceof Date && !isNaN(payload.getTime())) {
      return payload;
    }

    if (payload instanceof TimeMarkRepresentation) {
      return TimeMarkRepresentation.parseDateFromState(payload.asState());
    }

    return null;
  }

  static isPayloadValid(payload: any) {
    return TimeMarkRepresentation.parseDateFromPayload(payload) !== null;
  }

  static parseStateFromDate(date: Date | null): ITimeMarkRepresentationState | null {
    if (date && !isNaN(date.getTime())) {
      const minute = date.getMinutes();
      const second = date.getSeconds();

      return {
        minute,
        second,
      };
    }
    return null;
  }

  static parseDateFromState(state: ITimeMarkRepresentationState) {
    if (state !== null) {
      const now = new Date();

      const minute = state.minute;
      now.setMinutes(minute);

      const second = state.second;
      now.setSeconds(second);

      return now;
    }

    return null;
  }

  static getDifferenceInSeconds(start: TimeMarkRepresentation, end: TimeMarkRepresentation, fallback = -1): number {
    const dateStart = start.asDate();
    const dateEnd = end.asDate();

    if (dateStart !== null && dateEnd !== null) {
      const realDiff = Math.abs(differenceInSeconds(dateEnd, dateStart));
      return realDiff;
    }

    return fallback;
  }

  static getDifferenceInSecondsByPayloads(startPayload: any, endPayload: any, fallback = -1): number {
    const start = TimeMarkRepresentation.fromPayload(startPayload);
    const end = TimeMarkRepresentation.fromPayload(endPayload);

    return TimeMarkRepresentation.getDifferenceInSeconds(start, end, fallback);
  }
};
