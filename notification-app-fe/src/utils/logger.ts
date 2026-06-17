import axios from 'axios';

type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type Pkg = 'api' | 'component' | 'hook' | 'page' | 'state' | 'auth' | 'config' | 'middleware' | 'utils';

const ENDPOINT = 'http://4.224.186.213/evaluation-service/logs';

export const Log = async (
  stack: 'frontend',
  level: Level,
  pkg: Pkg,
  message: string
) => {
  try {
    if (import.meta.env.MODE !== 'production') {
      console.log(`[${level.toUpperCase()}] [${pkg}] ${message}`);
    }

    await axios.post(ENDPOINT, { stack, level, package: pkg, message }, {
      headers: {
        Authorization: 'Bearer dummy-evaluation-token-123',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    // swallow error so the main app doesn't crash if logging goes down
    console.error('Logger threw an error:', err);
  }
};
