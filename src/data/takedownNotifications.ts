export type TakedownNotification = {
  createdAt: string;
  link: string;
  title: string;
};

export const takedownNotifications: TakedownNotification[] = [
  {
    title: "Counterfeit Air Max listing removed",
    link: "https://example.com/notices/td-48291",
    createdAt: "Created 12 minutes ago",
  },
  {
    title: "Fake designer hoodie seller flagged",
    link: "https://example.com/notices/td-48277",
    createdAt: "Created 48 minutes ago",
  },
  {
    title: "Unauthorized watch listing reported",
    link: "https://example.com/notices/td-48218",
    createdAt: "Created 2 hours ago",
  },
];
