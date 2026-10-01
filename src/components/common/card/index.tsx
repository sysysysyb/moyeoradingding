import AnimationCard from './AnimationCard';
import type { AnimationCardProps, IdolCardProps } from './card.types';
import IdolCard from './IdolCard';

export default function Card(
  props:
    | ({ type: 'animation' } & Omit<AnimationCardProps, 'type'>)
    | ({ type: 'idol' } & Omit<IdolCardProps, 'type'>),
) {
  const { type } = props;
  if (type === 'animation') return <AnimationCard {...props} />;
  return <IdolCard {...props} />;
}
