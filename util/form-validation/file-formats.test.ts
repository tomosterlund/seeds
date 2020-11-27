import { checkFileFormat } from './file-format'

test('See if file format equals a format in the provided array', () => {
    expect(checkFileFormat('handsome.jpg', ['jpg', 'png', 'gif'])).toBeTruthy();
});

test('See if file format equals a format in the provided array', () => {
    expect(checkFileFormat('handsome.jpgg', ['jpg', 'png', 'gif'])).toBeFalsy();
});

test('See if file format equals a format in the provided array', () => {
    expect(checkFileFormat('handsome.mpeg', ['peg', 'png', 'gif'])).toBeTruthy();
});