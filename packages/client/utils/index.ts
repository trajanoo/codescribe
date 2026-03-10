export function createPageUrl(page: string): string {
  const normalized = page.trim().toLowerCase();

  switch (normalized) {
    case 'project':
      return '/project';
    default:
      return '/';
  }
}

