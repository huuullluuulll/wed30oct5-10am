export interface Director {
  name: string;
  role: string;
  appointed_date: string;
}

export interface Shareholder {
  name: string;
  shares: number;
  share_type: string;
  issue_date: string;
}

export interface Company {
  id: string;
  user_id: string;
  name_ar: string;
  name_en: string;
  registration_number: string;
  company_type: string;
  status: string;
  vat_number: string;
  utr_number: string;
  auth_code: string;
  incorporation_date: string;
  registered_address: string;
  directors: Director[];
  shareholders: Shareholder[];
  created_at: string;
  updated_at: string;
}