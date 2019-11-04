export interface AWSCredential {
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
}
