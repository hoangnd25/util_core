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

function fsCall(...args) {
  const w = window;
  try {
    if (typeof w.FS !== 'undefined') {
      w.FS.event(...args);
    }
  } catch (e) {
    console.error(e);
  }
}

export const wrappedCalls = {
  track: (...args) => beamCall('track', args),
  trackFS: (...args) => fsCall(...args),
  startSession: (...args) => beamCall('startSession', args),
  endSession: (...args) => beamCall('endSession', args),
  identify: (...args) => beamCall('identify', args),
  setContext: (...args) => beamCall('setContext', args),
};

export default wrappedCalls;
