export interface ISubProcService {
  exec(command: string): Promise<string>;
}
