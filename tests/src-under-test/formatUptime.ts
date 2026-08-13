/**
 * formatUptime - turns a number of seconds into a friendly string.
 *
 * This is a small, self-contained ("pure") function created for learning.
 * It is the same *kind* of helper the real platform uses to show how long a
 * server has been running (see the metrics service in the api-server).
 *
 * A "pure" function is the easiest thing in the world to test: give it an
 * input, check the output. No database, no network, no surprises.
 *
 * Examples:
 *   formatUptime(0)      -> "0s"
 *   formatUptime(59)     -> "59s"
 *   formatUptime(60)     -> "1m 0s"
 *   formatUptime(3661)   -> "1h 1m 1s"
 *   formatUptime(90061)  -> "1d 1h 1m 1s"
 */
export function formatUptime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    throw new Error('uptime seconds must be a non-negative number');
  }

  const seconds = Math.floor(totalSeconds);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${hours}h`);
  if (days > 0 || hours > 0 || minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}
