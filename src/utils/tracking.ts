function beamCall(func, args) {
  const w = window;
  try {
    if (typeof w.beam !== 'undefined') {
      w.beam[func](...args);
    }
  } catch (e) {
    // Do Nothing
  }
}

export const wrappedCalls = {
  track: (...args) => beamCall('track', args),
  startSession: (...args) => beamCall('startSession', args),
  endSession: (...args) => beamCall('endSession', args),
  identify: (...args) => beamCall('identify', args),
  setContext: (...args) => beamCall('setContext', args),
};

export default wrappedCalls;

