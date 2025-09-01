import path from 'path';

/**
 * Gets the correct path for Bible databases based on the environment
 */
export function getBiblesPath(): string {
  // For now, always use the source path
  // In production Electron, the files will be copied to the resources
  return path.join(process.cwd(), 'src', 'bibles', 'sqlite');
}

/**
 * Gets the path to a specific Bible database file
 */
export function getBibleDatabasePath(dbName: string): string {
  const biblesPath = getBiblesPath();
  return path.join(biblesPath, `${dbName}.bbl.mybible`);
}
