import { AsObservablePipe } from './as-observable.pipe';

describe('AsObservablePipe', () => {
  it('create an instance', () => {
    const pipe = new AsObservablePipe();
    expect(pipe).toBeTruthy();
  });
});
