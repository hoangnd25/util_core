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
