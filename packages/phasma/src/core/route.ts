export type RoutePart = {
  readonly type: 'static' | 'parameter';
  readonly value: string;
};

export const parse = (route: string): RoutePart[] => {
  const cleansed = route.trim().replace(/^\//, '');

  if (cleansed === '') {
    return [];
  }

  const parts = cleansed.split('/');

  return parts.map<RoutePart>((part) => {
    if (part[0] === '{') {
      return {
        type: 'parameter',
        value: part.slice(1, -1),
      };
    }

    return {
      type: 'static',
      value: part,
    };
  });
};
