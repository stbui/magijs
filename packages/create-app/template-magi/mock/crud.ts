export default {
  'GET /api/users': {
    code: 0,
    message: '',
    result: {
      list: [
        { id: 1, name: 1 },
        { id: 2, name: 2 },
      ],
      total: 40,
    },
  },
  'POST /api/users': { code: 0, message: '', result: { id: 1, name: 1 } },
  'POST /api/users/1': { code: 0, message: '', result: { id: 1, name: 2 } },
  'GET /api/users/1': { code: 0, message: '', result: { id: 1, name: 2 } },
};
