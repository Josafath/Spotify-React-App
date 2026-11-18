import { LogOut } from 'lucide-react';
import { buttonClass } from '@/components/button';
import { pickImage } from '@/lib/spotify/images';
import type { UserProfile } from '@/lib/spotify/types';
import styles from './AccountMenu.module.css';

interface AccountMenuProps {
    profile: UserProfile | undefined;
    onSignOut: () => void;
}

export function AccountMenu({ profile, onSignOut }: AccountMenuProps) {
    const name = profile?.display_name ?? 'Spotify user';
    const avatar = pickImage(profile?.images, 64);

    return (
        <div className={styles.account}>
            {profile ? (
                <a className={styles.profile} href={profile.external_urls.spotify} target="_blank" rel="noreferrer">
                    <span className={styles.avatar} aria-hidden="true">
                        {avatar ? <img src={avatar} alt="" width={32} height={32} /> : name.charAt(0).toUpperCase()}
                    </span>
                    <span className={styles.name}>{name}</span>
                </a>
            ) : null}
            <button type="button" className={buttonClass('quiet')} onClick={onSignOut}>
                <LogOut size={16} aria-hidden="true" />
                <span className={styles.signOutLabel}>Sign out</span>
            </button>
        </div>
    );
}
