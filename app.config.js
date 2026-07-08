// On EAS builders the GoogleService-Info.plist is delivered as a secret file
// env var (the file itself is gitignored and never committed); locally the
// app.json path resolves to the untracked file in the repo root.
module.exports = ({config}) => ({
  ...config,
  ios: {
    ...config.ios,
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST_FILE ?? config.ios.googleServicesFile
  }
})
