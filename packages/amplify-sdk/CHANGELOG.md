# v1.4.0 (Oct 21, 2020)

 * feat: Added `region` to org info.
 * chore: Updated AMPLIFY CLI references to Axway CLI.
   ([CLI-100](https://jira.axway.com/browse/CLI-100))
 * chore: Updated dependencies.

# v1.3.0 (Oct 1, 2020)

 * feat: Added proxy server support. ([CLI-98](https://jira.axway.com/browse/CLI-98))
 * feat: Added `auth.findSession()` helper that is the same as `auth.loadSession()` except it does
   not persist the newly loaded account in the token store.
 * refactor: Switched from using `got` directly to `amplify-request`.
 * fix: Added missing `coverage` and `docs` npm scripts.
 * fix: Switched to launching the web browser to switch org instead of via API.
 * fix: Fallback to token and delete sid if server call returned a 401 unauthorized due to the sid
   becoming stale.
 * chore: Updated dependencies.

# v1.2.1 (Aug 31, 2020)

 * fix: Fixed misspelled property.

# v1.2.0 (Aug 28, 2020)

 * feat: Improved error messages.
 * feat: Added server error response `code` to exceptions.
 * fix: Added Titanium app `name` to list of required build verify parameters.
 * fix: Added missing `fingerprint_description` and `org_id` to build verify request parameters.

# v1.1.1 (Aug 27, 2020)

 * fix: Make Titanium build verify `ipaddress` optional.
 * chore: Updated dependencies.

# v1.1.0 (Aug 6, 2020)

 * chore: Updated dependencies.

# v1.0.6 (Jul 24, 2020)

 * feat: Added `entitlements` to the org data.
 * chore: Updated dependencies.

# v1.0.5 (Jul 2, 2020)

 * fix: Fixed fetching org info where account does not have a platform account.
 * chore: Updated dependencies.

# v1.0.4 (Jun 12, 2020)

 * chore: Updated dependencies.

# v1.0.3 (Jun 9, 2020)

 * chore: Updated dependencies.

# v1.0.2 (May 19, 2020)

 * feat(login): Added support for `force` option to bypass the already authenticated check.
 * fix(switch-org): Refresh platform account details after switching org.
 * fix: Removed 2FA flag as it is no longer used.
 * chore: Updated dependencies.

# v1.0.1 (May 8, 2020)

 * chore: Updated dependencies.

# v1.0.0 (May 2, 2020)

 * Initial release.