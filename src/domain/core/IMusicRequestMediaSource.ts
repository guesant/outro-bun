export type IMusicRequestMediaSourceState = {
  provider: "youtube";
  id: string;
};

export interface IMusicRequestMediaSourceConstructor {
  new (state: IMusicRequestMediaSourceState): IMusicRequestMediaSourceInstance;

  fromURL(url: string): IMusicRequestMediaSourceInstance;

  parseURL(url: string): IMusicRequestMediaSourceState | null;

  isValidURL(url: string): boolean;
}

export interface IMusicRequestMediaSourceInstance {
  asState(): IMusicRequestMediaSourceState;

  asURL(): string;
}
