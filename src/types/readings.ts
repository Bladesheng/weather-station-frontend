export type Reading = {
  id: number;
  createdAt: Date;

  temperature_BMP: number;
  temperature_DHT: number;
  pressure_BMP: number;
  humidity_DHT: number;
};
