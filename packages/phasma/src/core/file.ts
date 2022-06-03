import path from 'path';

/**
 * Calculate the directory between the given {@param filepath} and the given {@param target}.
 * Note, this requires that {@param target} is in the same path of {@param filepath}.
 */
export const common = (filepath: string, target: string): string => {
  const value = path.normalize(
    path.join(
      filepath,
      path.relative(filepath, target),
    ),
  );

  return filepath.replace(`${value}${path.sep}`, '');
};

/**
 * Remove the extension from the given {@param filepath}.
 */
export const extensionless = (filepath: string): string => {
  const values: string[] = [];
  const parsed = path.parse(filepath);

  if (parsed.root !== '') {
    values.push(parsed.root);
  }

  if (parsed.dir !== '') {
    values.push(parsed.dir);
  }

  if (parsed.name !== '') {
    values.push(parsed.name);
  }

  return path.join(...values);
};
