import DateFormat from './date-tag'

test('test that date format is correct', () => {
    expect(DateFormat('2020-11-26T15:20:06.471Z')).toBe('Nov 26, 2020');
})