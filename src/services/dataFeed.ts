import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '../utils/http';
import { AWSCredential, MappingField } from '../types/userDataFeed';
import BaseService from "./baseService";

const defaultHttp = createHttp();

export interface MappedFields { [key: string]: string }
export type CsvData = string[][];

export interface CreateMappingPayload {
  type: 'account',
  mappings: MappedFields,
  rows: CsvData,
}

class DataFeedService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  async fetchMappingFields(portalId: number): Promise<MappingField[] | null> {
    const { data: allFields } = await this.http.get(`/user-feed/fields/${portalId}/account`);
    const { data: allMappingFields } = await this.http.get(`/user-feed/mapping/${portalId}`);
    const mappingData = (allMappingFields || {}).mappings || {};

    if (allFields) {
      return Object.getOwnPropertyNames(allFields)
        .map(fieldName => {
          const { label, type, enum: options, mandatory, published } = allFields[fieldName];
          return {
            type,
            label,
            options,
            name: fieldName,
            required: !!mandatory,
            published: !!published,
            mappedField: mappingData[fieldName],
          };
        })
        .filter(field => !!field.published);
    }

    return null;
  }

  createMapping(payload: CreateMappingPayload, portalId: number): Promise<AWSCredential> {
    return this.http.put(`/user-feed/mapping/${portalId}`, payload);
  }

  createAWSCredentials(portalId: number): Promise<AWSCredential> {
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
      };
    }

    return null;
  }
}

export default function(http?: HttpInstance) {
  return new DataFeedService(http);
}
