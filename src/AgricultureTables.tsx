import React, { useEffect, useState } from 'react';
import './AgricultureTables.css';
import { Table } from '@mantine/core';

/**
 * Types for dataset and table data
 */
type DatasetEntry = {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': string;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': string;
  'Area Under Cultivation (UOM:Ha(Hectares))': string;
};

type YearlyCropData = {
  year: string;
  maxCrop: string;
  minCrop: string;
};

type CropAverageData = {
  crop: string;
  avgYield: string;
  avgArea: string;
};

// Import dataset
import dataset from './constant/Manufac_India_Agro_Dataset.json';

/**
 * Helper function to parse string values into numbers.
 * Returns 0 if parsing fails or the value is undefined.
 */
const parseOrZero = (value: string | undefined): number => parseFloat(value || '0') || 0;

/**
 * Processes the dataset to calculate:
 * 1. Yearly maximum and minimum crop production.
 * 2. Average yield and cultivation area for each crop.
 */
const processData = (dataset: DatasetEntry[]) => {
  const yearCropProduction: Record<
    string,
    { max: { crop: string; production: number }; min: { crop: string; production: number } }
  > = {};
  const cropDetails: Record<string, { totalYield: number; totalArea: number; count: number }> = {};

  dataset.forEach((entry) => {
    const year = entry.Year?.match(/\d{4}/)?.[0] || '0';
    const cropName = entry['Crop Name'] || '0';
    const production = parseOrZero(entry['Crop Production (UOM:t(Tonnes))']);
    const yieldPerHa = parseOrZero(entry['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']);
    const area = parseOrZero(entry['Area Under Cultivation (UOM:Ha(Hectares))']);

    // Update yearly crop production data
    if (!yearCropProduction[year]) {
      yearCropProduction[year] = { max: { crop: cropName, production }, min: { crop: cropName, production } };
    } else {
      if (production > yearCropProduction[year].max.production) {
        yearCropProduction[year].max = { crop: cropName, production };
      }
      if (production < yearCropProduction[year].min.production) {
        yearCropProduction[year].min = { crop: cropName, production };
      }
    }

    // Update crop details for averages
    if (!cropDetails[cropName]) {
      cropDetails[cropName] = { totalYield: yieldPerHa, totalArea: area, count: 1 };
    } else {
      cropDetails[cropName].totalYield += yieldPerHa;
      cropDetails[cropName].totalArea += area;
      cropDetails[cropName].count += 1;
    }
  });

  const table1Data: YearlyCropData[] = Object.entries(yearCropProduction).map(([year, data]) => ({
    year,
    maxCrop: data.max.crop,
    minCrop: data.min.crop,
  }));

  const table2Data: CropAverageData[] = Object.entries(cropDetails).map(([crop, data]) => ({
    crop,
    avgYield: (data.totalYield / data.count).toFixed(3),
    avgArea: (data.totalArea / data.count).toFixed(3),
  }));

  return { table1Data, table2Data };
};

const AgricultureTables: React.FC = () => {
  // State for table data
  const [table1Data, setTable1Data] = useState<YearlyCropData[]>([]);
  const [table2Data, setTable2Data] = useState<CropAverageData[]>([]);

  // Effect to process dataset and set table data
  useEffect(() => {
    if (!dataset || dataset.length === 0) {
      console.warn('Dataset is empty or not loaded');
      return;
    }
    const { table1Data, table2Data } = processData(dataset);
    setTable1Data(table1Data);
    setTable2Data(table2Data);
  }, []);

  return (
    <div>
      <h2>Table 1: Yearly Crop Production</h2>
      <Table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Crop with Max Production</th>
            <th>Crop with Min Production</th>
          </tr>
        </thead>
        <tbody>
          {table1Data.length === 0 ? (
            <tr>
              <td colSpan={3}>No data available</td>
            </tr>
          ) : (
            table1Data.map((row, index) => (
              <tr key={index}>
                <td>{row.year}</td>
                <td>{row.maxCrop}</td>
                <td>{row.minCrop}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <h2>Table 2: Average Crop Yield and Area (1950-2020)</h2>
      <Table>
        <thead>
          <tr>
            <th>Crop</th>
            <th>Average Yield (Kg/Ha)</th>
            <th>Average Area (Ha)</th>
          </tr>
        </thead>
        <tbody>
          {table2Data.length === 0 ? (
            <tr>
              <td colSpan={3}>No data available</td>
            </tr>
          ) : (
            table2Data.map((row, index) => (
              <tr key={index}>
                <td>{row.crop}</td>
                <td>{row.avgYield}</td>
                <td>{row.avgArea}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AgricultureTables;
