export type ITimeMarkRepresentationState = {
  minute: number;
  second: number;
} | null;

export interface ITimeMarkRepresentationConstructor {
  new (): ITimeMarkRepresentationInstance;

  fromPayload(payload: any): ITimeMarkRepresentationInstance;

  isPayloadValid(payload: any): boolean;

  parseDateFromPayload(payload: any): Date | null;
  parseStateFromDate(date: Date | null): ITimeMarkRepresentationState | null;

  getDifferenceInSeconds(start: ITimeMarkRepresentationInstance, end: ITimeMarkRepresentationInstance, fallback?: number): number;

  getDifferenceInSecondsByPayloads(startPayload: any, endPayload: any, fallback?: number): number;
}

export interface ITimeMarkRepresentationInstance {
  setStateFromDate(date: Date | null): void;
  setStateFromPayload(payload: any): void;

  hasState(): boolean;

  asDate(): Date | null;
  asString(fallback?: boolean): string;
}
