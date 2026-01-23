'use client';

import Image from '@components/ui/image';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import { useTranslation } from 'src/app/i18n/client';

const teamData = [
  {
    id: 1,
    name: 'Tasif',
    role: 'Frontend Developer',
    thumbnail: '/assets/images/about/tasif.png',
    bio: 'Tasif is the mastermind behind the sleek and responsive user interface of NovaMart, ensuring a seamless shopping experience for all users.',
  },
  {
    id: 2,
    name: 'Meheraj',
    role: 'Backend Developer',
    thumbnail: '/assets/images/about/meheraj.png',
    bio: 'Meheraj powers the core of NovaMart, managing the complex server-side logic and database architecture that keeps everything running smoothly.',
  },
  {
    id: 3,
    name: 'Tarek',
    role: 'Did Nothing',
    thumbnail: '/assets/images/about/tarek.png',
    bio: 'Tarek is the heart of the team, providing moral support and ensuring the vibes are always right, even if he claims he "did nothing".',
  },
];

const AboutTeam = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
      {teamData.map((item) => (
        <div key={item.id} className="flex flex-col items-center text-center">
          <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-brand shadow-card">
            <Image
              src={item.thumbnail}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <Heading variant="titleMedium" className="mb-1 font-manrope">
            {item.name}
          </Heading>
          <Text className="text-brand font-semibold mb-3 uppercase tracking-wider text-xs font-manrope">
            {item.role}
          </Text>
          <Text className="text-sm leading-relaxed text-brand-muted">
            {item.bio}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default AboutTeam;
