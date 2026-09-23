export type Category = {
  slug: string;
  title: string;
  children: readonly Category[];
};
