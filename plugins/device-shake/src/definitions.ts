export interface DeviceShakePlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
