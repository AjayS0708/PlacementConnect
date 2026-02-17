export type RbStep = {
  index: number;
  route: string;
  title: string;
};

export const RB_STEPS: RbStep[] = [
  { index: 1, route: '/resume-builder/rb/01-problem', title: 'Problem' },
  { index: 2, route: '/resume-builder/rb/02-market', title: 'Market' },
  { index: 3, route: '/resume-builder/rb/03-architecture', title: 'Architecture' },
  { index: 4, route: '/resume-builder/rb/04-hld', title: 'HLD' },
  { index: 5, route: '/resume-builder/rb/05-lld', title: 'LLD' },
  { index: 6, route: '/resume-builder/rb/06-build', title: 'Build' },
  { index: 7, route: '/resume-builder/rb/07-test', title: 'Test' },
  { index: 8, route: '/resume-builder/rb/08-ship', title: 'Ship' }
];
