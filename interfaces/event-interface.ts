export interface ISentEvent {
  type: 'failed' | 'success';
  data: any;
};