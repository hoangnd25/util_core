import { ReactNode } from 'react';
import { Value as SlateValue } from 'slate';
import { GO1Portal } from '@src/types/user';

export interface FormValues {
  logo?: File | string | null;
  featuredImage?: File | string | null;
  loginTitle?: string;
  loginDescription?: string;
  signupTitle?: string;
  signupDescription?: string;
  portalColor?: string;
  signatureImage?: File | string | null;
  signatureName?: string;
  signatureTitle?: string;
  dashboardWelcomeMessage?: SlateValue | string;
  dashboardImageScale?: string;
  dashboardImage?: File | string | null;
  dashboardIcon?: File | string | null;
}

export interface FormApplyCustomizationValues {
  applyCustomizationLogo?: boolean;
  applyCustomizationPortalColor?: boolean;
  applyCustomizationFeaturedImage?: boolean;
  applyCustomizationCertificate?: boolean;
  applyCustomizationDashboard?: boolean;
  applyCustomizationLogin?: boolean;
  applyCustomizationSignup?: boolean;
}

export interface ThemeSettingsFormProps {
  portal: GO1Portal;
  isSaving?: boolean;
  onSave: (values: object, childCustomizationGroups?: string[]) => Promise<void>;
  onUpload: (image?: File | Blob | null) => Promise<string | undefined>;
  onError?: (message: ReactNode) => void;
}
