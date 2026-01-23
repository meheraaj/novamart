'use client';

import { useTranslation } from 'src/app/i18n/client';
import Container from '@components/ui/container';
import PageContactHeroSection from '@components/ui/page-contact-hero-section';
import AboutTeam from '@components/about/about-team';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';

export default function AboutPageContent({ lang }) {
    const { t } = useTranslation(lang, 'about');
    return (
        <>
            <PageContactHeroSection 
                lang={lang} 
                heroTitle="About Our Team"
                heroDescription="Meet the passionate individuals behind NovaMart who are dedicated to bringing you the best shopping experience."
            />
            <div className="py-12 lg:py-16 2xl:py-20">
                <Container>
                    <div className="max-w-[1420px] mx-auto mb-12 lg:mb-14 xl:mb-16">
                        <div className="bg-brand-light w-full p-8 md:p-12 lg:p-16 xl:p-20 shadow-contact rounded-md -mt-16 relative z-10">
                            <div className="text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
                                <Heading variant="heading" className="mb-4 lg:mb-6 font-manrope">
                                    Our Mission
                                </Heading>
                                <Text className="text-base lg:text-lg leading-relaxed">
                                    At NovaMart, our mission is to revolutionize the way you shop for groceries. 
                                    We believe in quality, convenience, and community. Our team works tirelessly 
                                    to ensure that you have access to the freshest products at the best prices, 
                                    delivered right to your doorstep.
                                </Text>
                            </div>
                            
                            <Heading variant="titleLarge" className="text-center mb-10 lg:mb-14 font-manrope">
                                The Minds Behind NovaMart
                            </Heading>
                            
                            <AboutTeam lang={lang} />
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

