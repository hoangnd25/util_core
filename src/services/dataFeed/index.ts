import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from "@src/services/baseService";

const defaultHttp = createHttp();

export interface AWSCredential {
  isNew: boolean;
  awsCreatedDate: string;
  awsBucketUrl: string;
  awsAccessKeyId: string;
  awsSecretKey: string;
}

export interface MappingField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  published: boolean;
  options: any[];
  mappedField?: string;
  weight: string;
}

export interface MappingData {
  mappings: Record<string, string>;
  externalId?: string;
  updated: number;
  author: object;
}

export interface MappedFields { [key: string]: string }
export type CsvData = string[][];

export interface CreateMappingPayload {
  type: 'account',
  mappings: MappedFields,
  external_id: string,
  rows: CsvData,
}

class DataFeedService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  async fetchMappingFields(portalId: number): Promise<{ go1Fields: MappingField[], externalId: string } | null> {
    const { data: allFields } = await this.http.get(`/user-feed/fields/${portalId}/account`);
    const formattedResult = {
      go1Fields: [],
      externalId: 'mail',
    };

    if (allFields) {
      const allMappingFields = await this.fetchMappingData(portalId);
      const mappingData = (allMappingFields || {}).mappings || {};

      formattedResult.externalId = (allMappingFields || {}).externalId || 'mail';
      formattedResult.go1Fields = Object.getOwnPropertyNames(allFields)
        .map(fieldName => {
          const { label, type, enum: options, mandatory, published, weight } = allFields[fieldName];
          const formattedLabel = label === 'mail' ? 'email': label;
          return {
            type,
            label: formattedLabel,
            options,
            name: fieldName,
            weight: weight !== undefined ? weight : "0",
            required: mandatory === '1',
            published: published === '1',
            mappedField: mappingData[fieldName] || null,
          };
        })
        .filter(field => !!field.published);
    }

    return formattedResult;
  }

  createMapping(payload: CreateMappingPayload, portalId: number): Promise<AWSCredential> {
    return this.http.put(`/user-feed/mapping/${portalId}`, payload);
  }

  async fetchMappingData(portalId: number): Promise<MappingData> {
    const { data } = await this.http.get(`/user-feed/mapping/${portalId}`);
    const { mappings, updated = 0, author, external_id: externalId } = data || {};

    if (mappings) {
      const { first_name: firstName, last_name: lastName } = author || {};
      const fullName = [firstName, lastName].filter(field => !!field).join(' ');

      return {
        mappings,
        externalId,
        updated: updated * 1000,
        author: fullName ? { fullName } : null,
      };
    }

    return null;
  }

  createAWSCredentials(portalId: number, isFixData = false): Promise<AWSCredential> {
    return this.http.post(`/user-feed/connection/${ portalId }${ isFixData ? '?fix=true' : '' }`)
      .then(response => this.formatConnection(response.data, !isFixData));
  }

  async fetchAWSCredentials(portalId: number) {
    const { data } = await this.http.get(`/user-feed/connection/${ portalId }`);
    return this.formatConnection(data);
  }

  private formatConnection(rawData, isNew = false) {
    const {
      aws_bucket_url,
      aws_created_date,
      aws_access_key_id,
      aws_secret_access_key,
    } = rawData || {};

    if (aws_bucket_url) {
      return {
        isNew,
        awsBucketUrl: aws_bucket_url,
        awsCreatedDate: aws_created_date,
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
