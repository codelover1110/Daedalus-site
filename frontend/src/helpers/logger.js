import consola from 'consola/src/browser'





/**
 * wrapper around consola
 * 
 * @returns {Consola}
 */
const _logger = () => {

    function _log(level, message, tag) {
        switch (level) {
            case 'info':
                consola.info({ message, tag })
                break;
            case 'error':
                consola.error({ message, tag })
                break;
            case 'debug':
                consola.debug({ message, tag })
                break;
            case 'warn':
                consola.warn({ message, tag })
                break;

            default:
                break;
        }
    }
    return {
        info: (message, tag = "Default") => _log("info", message, tag),
        error: (message, tag = "Default") => _log("error", message, tag),
        debug: (message, tag = "Default") => _log("debug", message, tag),
        warn: (message, tag = "Default") => _log("warn", message, tag)
    }

}


/** create new instance to use within app */
const Logger = _logger();

export default Logger;