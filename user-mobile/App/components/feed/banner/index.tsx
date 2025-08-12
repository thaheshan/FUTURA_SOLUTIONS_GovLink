
import { GradientTopCard } from '@components/base/GradientTopCard';
import { UiText } from '@components/base/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';

export default function FeedBannerShort() {
    return (
        <GradientTopCard>
            <UiText style={styles.title} className='font-bold font-size-xl'>
                Ready to Explore InsiderHub?
            </UiText>
            <UiText style={styles.desc} >
                Dive into the world of creators with a sneak peek of their latest public posts! Browse the feed, discover fresh content and get a taste of what InsiderHub has to offer.
            </UiText>
        </GradientTopCard>
    );
}

const styles = StyleSheet.create({
    desc: {
        color: '#d4d4d8',
        lineHeight: 22,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 8,
    },
});
