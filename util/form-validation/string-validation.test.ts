import { isLongerThan } from './string-validation'

test('Checks whether a string is not empty, and not consisting of empty spaces', () => {
    expect(isLongerThan(" ", 1)).toBeFalsy();
})

test('Checks whether a string is not empty, and not consisting of empty spaces', () => {
    expect(isLongerThan("       ", 1)).toBeFalsy();
})

test('Checks whether a string is not empty, and not consisting of empty spaces', () => {
    expect(isLongerThan("", 1)).toBeFalsy();
})