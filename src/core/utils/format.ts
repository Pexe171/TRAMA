import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export const formatDate = (date: string | Date) =>
  dayjs(date).format('DD [de] MMMM [de] YYYY');

export const formatViews = (count: number) =>
  new Intl.NumberFormat('pt-BR').format(count);
