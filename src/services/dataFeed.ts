import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '../utils/http';

import BaseService from "./baseService";

const defaultHttp = createHttp();

export interface MappedFields { [key: string]: string }
export type CsvData = string[][];

export interface CreateMappingPayload {
  type: 'account',
  mappings: MappedFields,
  rows: CsvData,
}

export const fixedPortalFields = ['mail', 'first_name', 'last_name', 'status', 'roles', 'managers', 'groups'];

class DataFeedService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  public doMapping(portalField: string, csvField: string, mappedFields: MappedFields) {
    const formattedCsvField = `csv_${csvField}`;
    if (mappedFields[formattedCsvField]) {
      delete mappedFields[formattedCsvField];
    }
    return {
      ...mappedFields,
      [formattedCsvField]: portalField,
    };
  }

  public getRows(mappedFields: MappedFields, csvData: CsvData): string[][] {
    const fieldResults = [];
    let dataResults = [];
    for (const key in mappedFields) {
      if (mappedFields.hasOwnProperty(key)) {
        fieldResults.push(key);
      }
    }
    csvData.forEach((data, index) => {
      // exclude file's headers
      if (index !== 0) {
        dataResults = [...dataResults, data];
      }
    });

    return [fieldResults, ...dataResults];
  }

  public createMapping(payload: CreateMappingPayload, portalId: number): Promise<any> {
    return this.http.put(`/user-feed/mapping/${portalId}`, payload);
  }
}

export default function(http?: HttpInstance) {
  return new DataFeedService(http);
}
