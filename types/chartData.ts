export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}