import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import FollowButton from '../FollowButton/FollowButton';
import profileBig from '../../assets/profile-big.jpg';
import styles from './ProfileStats.module.scss';
import DeleteAccountButton from '../DeleteAccountButton/DeleteAccountButton';

export default function ProfileStats({
  avatarLink,
  firstName,
  lastName,
  username,
  articlesNumber,
  followersNumber,
  isFollowing,
  isMe,
  onFollow,
  onUnfollow,
  onDelete,
}: {
  avatarLink: string;
  firstName: string;
  lastName: string;
  username: string;
  articlesNumber: number;
  followersNumber: number;
  isFollowing: boolean;
  isMe: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onDelete: () => void;
}) {
  const { isDarkTheme } = useContext(DarkThemeContext);

  return (
    <div className={styles['profile-stats']}>
      <div
        className={styles['profile-stats__avatar']}
        style={{
          border: !avatarLink
            ? isDarkTheme
              ? '1px solid #757575'
              : '1px solid #dcdcdc'
            : '',
        }}
      >
        {avatarLink ? (
          <img src={avatarLink} alt="Profile avatar" crossOrigin="anonymous" />
        ) : (
          <img
            src={profileBig}
            alt="Profile avatar"
            crossOrigin="anonymous"
            style={{
              filter: isDarkTheme && !avatarLink ? 'invert(0.8)' : '',
              transition: 'filter .3s ease 0s',
            }}
          />
        )}
      </div>
      <div className={styles['profile-stats__content']}>
        <h2 className={styles['profile-stats__name']}>
          {`${firstName} ${lastName}`}
          {isMe ? ' (me)' : ''}
        </h2>
        <p
          className={styles['profile-stats__username']}
          style={{ color: isDarkTheme ? '#9b9b9b' : '#757575' }}
        >
          {`@${username}`}
        </p>
        <div className={styles['profile-stats__articles-and-followers']}>
          <p>
            <b>{articlesNumber}</b> articles
          </p>
          <p>
            <b>{followersNumber}</b> followers
          </p>
        </div>
        {isMe ? (
          <>
            <Link
              className={
                styles[
                  isDarkTheme
                    ? 'profile-stats__edit-button-dark'
                    : 'profile-stats__edit-button'
                ]
              }
              type="button"
              to={`edit`}
            >
              Edit
            </Link>
            <DeleteAccountButton onDelete={onDelete} />
          </>
        ) : (
          <FollowButton
            isFollowing={isFollowing}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
          />
        )}
      </div>
    </div>
  );
}
