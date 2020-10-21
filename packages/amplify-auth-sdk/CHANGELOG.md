# v2.3.1 (Oct 21, 2020)

 * fix: No longer move old v1 token store as it breaks products still using older amplify-cli-util
   versions.
 * fix: Create the `keytar` prefix directory if it doesn't exist.
 * chore: Updated dependencies.

# v2.3.0 (Oct 1, 2020)

 * fix: Improved error handling if the default web browser fails to launch.
 * fix: Added missing `coverage` and `docs` npm scripts.
 * fix: Fixed bug where `env` was being clobbered.
 * fix: Removed `wait` option when launching web browser as setting this flag to `true` would cause
   the login to pause indefinitely.
 * fix: Logout debug logging referenced undefined account auth properties.
 * fix: Added back proxy server support. ([CLI-98](https://jira.axway.com/browse/CLI-98))
 * fix: Improved error handling when fetching token. ([CLI-99](https://jira.axway.com/browse/CLI-99))
 * refactor: Switched from using `got` directly to `amplify-request`.
 * chore: Updated dependencies.

# v2.2.1 (Aug 27, 2020)

 * chore: Updated dependencies.

# v2.2.0 (Aug 6, 2020)

 * refactor(secure-store): Moved keytar file from `~/.axway/lib` to `~/.axway/amplify-cli/lib`.
 * refactor(file-store): Moved token store file from `~/.axway` to `~/.axway/amplify-cli`.
 * chore: Updated dependencies.

# v2.1.3 (Jul 24, 2020)

 * fix: Added token store backwards compatibility by writing both a v2 and v1 versions of the token
   store. See readme for details.
 * fix: Copy options object so the original reference isn't modified.
 * fix: `env` in the account object was the resolved environment settings including URLs instead of
   just the environment name.
 * chore: Updated dependencies.

# v2.1.2 (Jul 2, 2020)

 * fix: Fixed bug when fetching user info and a non-HTTP error occurs where the error object does
   not have an HTTP response.
 * chore: Updated dependencies.

# v2.1.1 (Jun 12, 2020)

 * chore: Updated dependencies.

# v2.1.0 (Jun 9, 2020)

 * style(secure-store): Added keytar version to error message.
 * chore: Updated keytar from v5.6.0 to v6.0.1.
 * chore: Updated dependencies.

# v2.0.4 (May 20, 2020)

 * fix(signed-jwt): Fixed JWT expiration to be seconds, not milliseconds.

# v2.0.3 (May 19, 2020)

 * fix: Improved `got` request error handling.
 * fix: Fixed major bug where the authenticator hash was being computed before the criteria needed
   to compute the hash was defined.
 * fix: Allow `env` to be a string or environment object.
 * chore: Added more debug logging.
 * chore: Updated dependencies.

# v2.0.2 (May 8, 2020)

 * fix(file-store): Update token store on disk if an expired token has been purged.

# v2.0.1 (May 6, 2020)

 * fix: Fixed typo when referencing account's refresh token's expiration.
 * chore: Updated dependencies.

# v2.0.0 (May 1, 2020)

 * BREAKING CHANGE: Dropped support for Node.js 10.12.0 and older.
   ([CLI-89](https://jira.axway.com/browse/CLI-89))
 * BREAKING CHANGE: Changed structure of `account` info by moving auth-related info into an `auth`
   property.
 * BREAKING CHANGE: No longer populate org info after login or getting token from store. Logic was
   moved to the AMPLIFY SDK.
 * BREAKING CHANGE: Removed `Auth.switchOrg()`. Logic has been moved to AMPLIFY SDK.
 * BREAKING CHANGE: Removed `Auth.sendAuthCode()` and support for two factor authentication.
 * BREAKING CHANGE: `Auth.getAccount()` has been renamed to `Auth.find()`.
 * BREAKING CHANGE: `Auth.revoke()` has been renamed to `Auth.logout()`.
 * refactor: Replaced `@axway/amplify-request` with [`got`](https://www.npmjs.com/package/got).
 * feat: Browser redirects to platform dashboard upon successful login.
 * feat: Added `Auth.updateAccount()` method to store updated account (after populating org info) in token store.
 * feat: Added support for environment synonyms such as "production" for "prod".
   ([CLI-87](https://jira.axway.com/browse/CLI-87))
 * fix: Removed deprecated URL parsing.
 * chore: Fixed lint issues, namely around Node.js `URL` deprecations.
 * chore: Updated keytar from v5.0.0 to v5.6.0.
 * chore: Updated dependencies.