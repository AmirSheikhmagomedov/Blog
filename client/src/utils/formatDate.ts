import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const formatDate = (date: string) => {
  const currentDate = new Date();

  const formattedDate = dayjs(date);

  const dayDifference =
    Number(currentDate.getDate()) - Number(formattedDate.date());

  const isCurrentYear =
    Number(currentDate.getFullYear()) === Number(formattedDate.year());

  if (!isCurrentYear) return formattedDate.format('LL');

  if (dayDifference === 1) return 'yesterday';

  if (dayDifference > 2) return formattedDate.format('LL').split(',')[0];

  return formattedDate.fromNow();
};

export default formatDate;
