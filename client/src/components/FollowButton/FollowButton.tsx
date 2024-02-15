import { useContext } from 'react';
import styles from './FollowButton.module.scss';
import { DarkThemeContext } from '../../context/DarkThemeProvider';

export default function FollowButton({
  isFollowing,
  onFollow,
  onUnfollow,
}: {
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}) {
  const { isDarkTheme } = useContext(DarkThemeContext);

  return (
    <button
      onClick={() => {
        if (isFollowing) onUnfollow();
        if (!isFollowing) onFollow();
      }}
      type="button"
      className={
        styles[
          isDarkTheme
            ? isFollowing
              ? 'following-button-dark'
              : 'follow-button-dark'
            : isFollowing
            ? 'following-button'
            : 'follow-button'
        ]
      }
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
