export class SessionModel {

  public session_guid?: string;
  public name: string;
  public location: {latitude: number, longitude: number};
  public start_time: number;
  public end_time: number;
  public value: number;


}
