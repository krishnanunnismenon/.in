type Project = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

// Public portfolio facts only. Scene state and illustrative lesson data stay separate.
export const portfolio = {
  name: 'Krishnanunni',
  role: 'Full-stack developer',
  email: 'hello@krishnanunni.in',
  introduction: 'I build software at chargeMOD, where I’m a Team Lead. I like figuring things out—and making them easier to understand.',
  background: 'I studied commerce at Maharajas College, Ernakulam, and learned development through self-study and freelance work.',
  interests: 'Usually curious about open source, small electronics, and useful AI tools. Happy to talk in Malayalam or English.',
  social: [
    { label: 'GitHub', href: 'https://github.com/krishnanunnismenon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/krishnanunnii/' },
  ],
  projects: [
    {
      id: 'thinkpad',
      title: 'What makes a laptop a server?',
      description: 'My ThinkPad runs open-source services and serves my music.',
      href: '/lab/thinkpad',
    },
    {
      id: 'connected-systems',
      title: 'Helping charging systems talk',
      description: 'At chargeMOD, I work on APIs, membership logic and charging integrations.',
    },
  ] satisfies Project[],
  musicClient: {
    name: 'ArunJuke',
    href: 'https://github.com/krishnanunnismenon/ArunJuke',
    contribution: 'I adapted and rebranded an existing music app to connect to my server.',
  },
} as const;
