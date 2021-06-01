export class ImageUploadError extends Error {
  constructor(message?: string) {
    super(message || 'Image upload failed');
    this.name = 'ImageUploaddError';
  }
}

export class ApplyCustomizationdError extends Error {
  constructor(message?: string) {
    super(message || 'Apply customization failed');
    this.name = 'ApplyCustomizationdError';
  }
}

export class FormSaveError extends Error {
  constructor(message?: string) {
    super(message || 'Form saving failed');
    this.name = 'FormSaveError';
  }
}
