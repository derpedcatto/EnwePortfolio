export interface Category {
  slug: string;
  title: string;
  order: number;
  parent: string | null;
}
