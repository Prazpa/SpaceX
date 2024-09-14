export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  links: {
    patch: {
      small: string;
    };
  };
  crew: string[];
  success: boolean;
  details?: string;
  rocket: string;
  launchpad: string;
}
