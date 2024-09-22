export interface messageGroupI {
  username: string;
  color: string;
  messages: messageI[];
}

export interface messageI {
  id: string;
  message: string;
  time?: string;
}
