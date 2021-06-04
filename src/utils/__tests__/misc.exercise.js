import { formatDate } from 'utils/misc';

test.todo('formatDate formats the date to look nice')
// expect(formatDate())
test('formatDate formats the date to look nice', () =>{
  expect(formatDate(new Date('May 27, 2011'))).toBe('May 11')
})
