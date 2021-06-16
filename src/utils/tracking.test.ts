import Tracking from './tracking';

describe('tracking utils', () => {
  test('beamIdentify', () => {
    window.beam = {
      track: jest.fn(),
    };
    const user = {};
    const portal = {};
    const currentSession = {
      user,
      portal,
    };
    Tracking.track(currentSession);
    expect(window.beam.track).toHaveBeenCalledWith(currentSession);
  });
});
