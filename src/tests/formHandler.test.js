import { updateUI } from '../client/js/formHandler';


describe('Function existence check', () => {
  test('Return true', () => {
    expect(updateUI).toBeDefined();
  });
});