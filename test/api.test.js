const request = require('supertest');
const { app, reset } = require('../src/app');

beforeEach(() => reset());

describe('Budget Tracker API', () => {
  test('health check works', async () => {
    const res = await request(app).get('/api/health').expect(200);
    expect(res.body.status).toBe('healthy');
  });

  test('starts with no transactions', async () => {
    const res = await request(app).get('/api/transactions').expect(200);
    expect(res.body).toEqual([]);
  });

  test('adds an expense', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ description: 'Groceries', amount: 42.5, type: 'expense', category: 'Food' })
      .expect(201);
    expect(res.body.id).toBe(1);
    expect(res.body.category).toBe('Food');
  });

  test('rejects a negative amount', async () => {
    await request(app)
      .post('/api/transactions')
      .send({ description: 'Bad', amount: -5, type: 'expense' })
      .expect(400);
  });

  test('rejects a missing description', async () => {
    await request(app)
      .post('/api/transactions')
      .send({ amount: 10, type: 'income' })
      .expect(400);
  });

  test('deletes a transaction', async () => {
    await request(app).post('/api/transactions').send({ description: 'Bus', amount: 2, type: 'expense', category: 'Transport' });
    await request(app).delete('/api/transactions/1').expect(200);
    await request(app).delete('/api/transactions/1').expect(404);
  });

  test('summary adds up income, expenses, and balance', async () => {
    await request(app).post('/api/transactions').send({ description: 'Campus job', amount: 300, type: 'income', category: 'Income' });
    await request(app).post('/api/transactions').send({ description: 'Textbook', amount: 80, type: 'expense', category: 'Books' });
    await request(app).post('/api/transactions').send({ description: 'Pizza', amount: 20.25, type: 'expense', category: 'Food' });
    const res = await request(app).get('/api/summary').expect(200);
    expect(res.body.income).toBe(300);
    expect(res.body.expenses).toBe(100.25);
    expect(res.body.balance).toBe(199.75);
    expect(res.body.byCategory).toEqual({ Books: 80, Food: 20.25 });
  });
});
