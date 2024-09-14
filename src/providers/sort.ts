import { ref } from 'vue';
import { Launch } from '../providers/Launch';
import { launches } from '../providers/fetchData';

const sortAsc = ref<Record<string, boolean>>({
  name: true,
  date_utc: true,
  crew: true,
  success: true,
});

export const sortByField = (field: keyof Launch | 'date_utc'): void => {
  launches.value.sort((a, b) => {
    let fieldA: any, fieldB: any;

    if (field === 'date_utc') {
      fieldA = new Date(a.date_utc);
      fieldB = new Date(b.date_utc);
    } else {
      fieldA = a[field];
      fieldB = b[field];
    }

    return sortAsc.value[field]
      ? fieldA > fieldB
        ? 1
        : -1
      : fieldA < fieldB
      ? 1
      : -1;
  });
  sortAsc.value[field] = !sortAsc.value[field];
};
