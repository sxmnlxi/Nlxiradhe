export const BANNERS = [
  { id: 'b1', title: 'Join our Telegram', subtitle: 'Get instant offer alerts', color: '#0088CC', icon: 'paper-plane', url: 'https://t.me/yourchannel' },
  { id: 'b2', title: 'Follow us on Instagram', subtitle: "Don't miss new offers", color: '#C13584', icon: 'logo-instagram', url: 'https://instagram.com/yourpage' },
];

export const OFFERS = [
  { id: 'o1', name: 'Stocko - Complete KYC', logoColor: '#2B3A67', icon: 'business', reward: 50, description: 'Download Stocko, sign up, and complete your KYC verification to earn coins. Usually takes 5-10 minutes.', isUnlimited: false },
  { id: 'o2', name: 'Watch a video', logoColor: '#FF3E86', icon: 'play-circle', reward: 1, description: 'Watch a short video ad in full to earn a small coin reward. You can repeat this anytime.', isUnlimited: true },
  { id: 'o3', name: 'Parimatch - Sign up', logoColor: '#111111', icon: 'football', reward: 650, description: 'Create a new account and make your first deposit to earn a large coin reward.', isUnlimited: false },
];
export const OFFERS = [
  {
    id: 'o1',
    name: 'Stocko - Complete KYC',
    logoColor: '#2B3A67',
    icon: 'business',
    reward: 50,
    description:
      'Download Stocko, sign up, and complete your KYC verification to earn coins. Usually takes 5-10 minutes.',
    instructions: [
      'Install Stocko from the official store.',
      'Create a new account with your own details.',
      'Finish KYC verification and return here.',
    ],
    isUnlimited: false,
  },
  {
    id: 'o2',
    name: 'Watch a video',
    logoColor: '#FF3E86',
    icon: 'play-circle',
    reward: 1,
    description:
      'Watch a short video ad in full to earn a small coin reward. You can repeat this anytime.',
    instructions: [
      'Tap Start Offer.',
      'Watch the complete video without closing it.',
      'Your reward is verified automatically.',
    ],
    isUnlimited: true,
  },
  {
    id: 'o3',
    name: 'Parimatch - Sign up',
    logoColor: '#111111',
    icon: 'football',
    reward: 650,
    description:
      'Create a new account and make your first deposit to earn a large coin reward.',
    instructions: [
      'Open the partner offer.',
      'Sign up as a new user.',
      'Complete the partner requirements for verification.',
    ],
    isUnlimited: false,
  },
];
