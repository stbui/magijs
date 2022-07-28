import { request } from '@magi/magi';

export function query({ page }: any) {
  return request(`/api/demo?page=${page}`);
}

export function remove(id: number | string) {
  return request(`/api/demo/${id}`, {
    method: 'DELETE',
  });
}

export function patch(id: number | string, values: any) {
  return request(`/api/demo/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export function create(values: any) {
  return request('/api/demo', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
