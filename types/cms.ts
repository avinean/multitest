export type RichText = {
  id: string;
  type: 'rich-text';
  content: string;
};

export type Image = {
  id: string;
  type: 'image';
  imageUrl: string;
  alt: string;
  title: string;
  caption: string;
};

export type Grid = {
  id: string;
  type: 'grid';
  columns: {
    sm: number;
    md: number;
    lg: number;
  };
  cells: Section[];
};

export type QuestionGroup = {
  id: string;
  type: 'question-group';
  questionGroupId: string;
  title?: string;
  description?: string;
};

export type Section = RichText | Image | Grid | QuestionGroup;