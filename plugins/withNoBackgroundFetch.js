// eslint-disable-next-line @typescript-eslint/no-var-requires
const {withInfoPlist} = require('expo/config-plugins')

// expo-task-manager's config plugin unconditionally adds the "fetch"
// UIBackgroundModes entry, but this app never schedules background fetch —
// only background location for run tracking. Declaring an unused background
// mode gets flagged by App Review (guideline 2.5.4), so strip it.
const withNoBackgroundFetch = config =>
  withInfoPlist(config, pluginConfig => {
    if (Array.isArray(pluginConfig.modResults.UIBackgroundModes)) {
      pluginConfig.modResults.UIBackgroundModes = pluginConfig.modResults.UIBackgroundModes.filter(
        mode => mode !== 'fetch'
      )
    }

    return pluginConfig
  })

module.exports = withNoBackgroundFetch
