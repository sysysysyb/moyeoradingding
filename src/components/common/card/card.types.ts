export type CardTypes = 'animation' | 'idol';

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: CardTypes;
}

export interface AnimationCardProps extends BaseCardProps {
  title: string;
  description: string;
}

export interface IdolCardProps extends BaseCardProps {
  title: string;
  imageSrc?: string;
  detail: { idolGroup: string; position: string };
  idolId?: number;
  toggleFavorite: (id: number) => void;
}
