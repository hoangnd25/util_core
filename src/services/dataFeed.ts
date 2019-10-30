import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '../utils/http';
import { AWSCredential } from '../types/userDataFeed';
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
    const fieldResults = Object.getOwnPropertyNames(mappedFields);
    const dataResults = csvData.splice(1); // exclude file's headers

    return [fieldResults, ...dataResults];
  }

  public createMapping(payload: CreateMappingPayload, portalId: number): Promise<AWSCredential> {
    return this.http.put(`/user-feed/mapping/${portalId}`, payload)
      .then(() => this.createAWSCredentials(portalId));
  }

  private createAWSCredentials(portalId: number): Promise<AWSCredential> {
    return this.http.post(`/user-feed/connection/${ portalId }`)
      .then(() => this.fetchAWSCredentials(portalId));
  }

  async fetchAWSCredentials(portalId: number) {
    const { data } = await this.http.get(`/user-feed/connection/${ portalId }`);
    const { aws_bucket_url, aws_access_key_id, aws_secret_access_key } = data;

    if (data && aws_bucket_url) {
      return {
        awsBucketUrl: aws_bucket_url,
        awsAccessKeyId: aws_access_key_id,
        awsSecretKey: aws_secret_access_key,
      }
    }

    return null;
  }
}

export default function(http?: HttpInstance) {
  return new DataFeedService(http);
}
