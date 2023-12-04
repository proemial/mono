export type Paper = {
  id?: string;
  source?: {
    id: string;
    providers: string[];
    url: string;
    pdf: string;
  };

  version?: {
    date: string;
    name: string;
  };

  title?: string;
  abstract?: string;

  authors?: WithName[];

  categories?: WithName[];

  proems?: {
    title: string;
    abstract: string;
    tags: string[];
  };
};

type WithName = { name: string };
