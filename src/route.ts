export interface Route {
  route: string;
  protected: boolean;
  post?: (req: any, res: any) => Promise<void>;
  get?: (req: any, res: any) => Promise<void>;
  put?: (req: any, res: any) => Promise<void>;
  delete?: (req: any, res: any) => Promise<void>;
}
