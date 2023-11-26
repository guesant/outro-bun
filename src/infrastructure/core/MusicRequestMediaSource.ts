import { parseURL } from "ufo";
import {
  IMusicRequestMediaSourceConstructor,
  IMusicRequestMediaSourceInstance,
  IMusicRequestMediaSourceState,
} from "../../domain";

export const MusicRequestMediaSource: IMusicRequestMediaSourceConstructor = class MusicRequestMediaSource
  implements IMusicRequestMediaSourceInstance
{
  #state: IMusicRequestMediaSourceState;

  constructor(state: IMusicRequestMediaSourceState) {
    this.#state = state;
  }

  asState(): IMusicRequestMediaSourceState {
    return {
      id: this.#state.id,
      provider: this.#state.provider,
    };
  }

  asURL() {
    switch (this.#state.provider) {
      case "youtube": {
        return `https://www.youtube.com/watch?v=${this.#state.id}`;
      }
    }
  }

  static fromURL(url: string): IMusicRequestMediaSourceInstance {
    const state = MusicRequestMediaSource.parseURL(url);

    if (state !== null) {
      return new MusicRequestMediaSource(state);
    }

    throw new Error("The URL is either invalid or the provider is not supported.");
  }

  static parseURL(url: string): IMusicRequestMediaSourceState | null {
    const parsedURL = parseURL(url);

    const params = new URLSearchParams(parsedURL.search);

    if (
      (parsedURL.host === "www.youtube.com" || parsedURL.host === "music.youtube.com") &&
      parsedURL.pathname === "/watch" &&
      params.has("v")
    ) {
      const id = params.get("v")!;

      const state: IMusicRequestMediaSourceState = {
        id: id,
        provider: "youtube",
      };

      return state;
    }

    if (parsedURL.host === "youtu.be") {
      const state: IMusicRequestMediaSourceState = {
        id: parsedURL.pathname.slice(1),
        provider: "youtube",
      };

      return state;
    }

    return null;
  }

  static isValidURL(url: string) {
    return this.parseURL(url) !== null;
  }
};
