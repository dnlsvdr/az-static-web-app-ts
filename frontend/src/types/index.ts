export interface Student {
  StudentId?: number;
  FirstName: string;
  LastName: string;
  School: string;
}

export interface ApiResponse {
  message?: string;
  status?: number;
  data?: any;
}
