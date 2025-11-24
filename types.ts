export interface StockDataPoint {
  date: string;
  price: number;
  sma?: number;
}

export interface ComparisonDataPoint {
  date: string;
  price1: number;
  price2: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SingleAnalysisResult {
  type: 'SINGLE';
  ticker: string;
  currentPrice: number;
  data: StockDataPoint[];
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
  smaPeriod: number;
  sources: GroundingSource[];
}

export interface ComparisonResult {
  type: 'COMPARE';
  ticker1: string;
  ticker2: string;
  correlation: number;
  data: ComparisonDataPoint[];
  sources: GroundingSource[];
}

export type AnalysisResult = SingleAnalysisResult | ComparisonResult;

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}