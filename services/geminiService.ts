import { GoogleGenAI } from "@google/genai";
import { SingleAnalysisResult, ComparisonResult, StockDataPoint, ComparisonDataPoint, GroundingSource } from "../types";

const parseStockResponse = (text: string): StockDataPoint[] => {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          date: item.date || new Date().toISOString().split('T')[0],
          price: typeof item.close === 'number' ? item.close : parseFloat(item.close)
        })).filter(item => !isNaN(item.price));
      }
    }
    throw new Error("Could not parse JSON from response");
  } catch (e) {
    console.error("Parsing error:", e);
    return [];
  }
};

const calculateSMA = (data: StockDataPoint[], period: number): StockDataPoint[] => {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return sortedData.map((point, index, array) => {
    if (index < period - 1) {
      return { ...point, sma: undefined };
    }
    const slice = array.slice(index - period + 1, index + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.price, 0);
    return { ...point, sma: sum / period };
  });
};

const calculateCorrelation = (data: ComparisonDataPoint[]): number => {
  const n = data.length;
  if (n < 2) return 0;

  const x = data.map(d => d.price1);
  const y = data.map(d => d.price2);

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

const extractSources = (groundingChunks: any[]): GroundingSource[] => {
  const sources: GroundingSource[] = [];
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri
        });
      }
    });
  }
  return sources.slice(0, 5);
};

export const analyzeStock = async (ticker: string): Promise<SingleAnalysisResult> => {

  const ai = new GoogleGenAI({ apiKey: "AIzaSyAYTg_5lfCIso1wOsKt6REFln07pGjUqCc" });
  const model = "gemini-2.5-flash";
  const daysToFetch = 30; // Increased for better data
  const smaPeriod = 5;

  const prompt = `
    Find the closing stock prices for ${ticker} for the last ${daysToFetch} trading days.
    Strictly format your response as a valid JSON array of objects. 
    Each object must have exactly two properties:
    1. "date": string (YYYY-MM-DD format)
    2. "close": number (the closing price)
    Do not include markdown. Just the JSON string.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { tools: [{ googleSearch: {} }] },
  });

  const rawData = parseStockResponse(response.text || "");
  if (rawData.length === 0) throw new Error("Failed to retrieve valid stock data.");

  const processedData = calculateSMA(rawData, smaPeriod);
  const latestPoint = processedData[processedData.length - 1];
  const trend = (latestPoint && latestPoint.sma && latestPoint.price > latestPoint.sma) ? 'UP' : 'DOWN';

  return {
    type: 'SINGLE',
    ticker: ticker.toUpperCase(),
    currentPrice: latestPoint.price,
    data: processedData,
    trend,
    smaPeriod,
    sources: extractSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
  };
};

export const compareStocks = async (ticker1: string, ticker2: string): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyAYTg_5lfCIso1wOsKt6REFln07pGjUqCc" });
  const model = "gemini-2.5-flash";
  const daysToFetch = 30;

  const prompt = `
    Find the closing stock prices for BOTH ${ticker1} and ${ticker2} for the last ${daysToFetch} trading days.
    
    Strictly format your response as a valid JSON object with two keys: "stock1" and "stock2".
    "stock1" should contain the array for ${ticker1}.
    "stock2" should contain the array for ${ticker2}.
    
    Each array item must have:
    1. "date": string (YYYY-MM-DD)
    2. "close": number
    
    Ensure the dates align as much as possible.
    Do not include markdown.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { tools: [{ googleSearch: {} }] },
  });

  const text = response.text || "";
  let stock1Data: StockDataPoint[] = [];
  let stock2Data: StockDataPoint[] = [];

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      const mapData = (arr: any[]) => arr.map((item: any) => ({
        date: item.date,
        price: typeof item.close === 'number' ? item.close : parseFloat(item.close)
      })).filter(item => !isNaN(item.price));

      if (parsed.stock1 && Array.isArray(parsed.stock1)) stock1Data = mapData(parsed.stock1);
      if (parsed.stock2 && Array.isArray(parsed.stock2)) stock2Data = mapData(parsed.stock2);
    }
  } catch (e) {
    console.error("Comparison parsing error", e);
    throw new Error("Failed to parse comparison data.");
  }

  if (stock1Data.length === 0 || stock2Data.length === 0) {
    throw new Error("Insufficient data found for one or both stocks.");
  }

  // Merge data by date
  const mergedData: ComparisonDataPoint[] = [];
  const stock2Map = new Map(stock2Data.map(d => [d.date, d.price]));

  stock1Data.forEach(d1 => {
    const price2 = stock2Map.get(d1.date);
    if (price2 !== undefined) {
      mergedData.push({
        date: d1.date,
        price1: d1.price,
        price2: price2
      });
    }
  });

  // Sort by date
  mergedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (mergedData.length < 5) {
     throw new Error("Not enough overlapping price data found to calculate correlation.");
  }

  const correlation = calculateCorrelation(mergedData);

  return {
    type: 'COMPARE',
    ticker1: ticker1.toUpperCase(),
    ticker2: ticker2.toUpperCase(),
    correlation,
    data: mergedData,
    sources: extractSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
  };
};
