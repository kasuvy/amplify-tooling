import npa from 'npm-package-arg';
import semver from 'semver';

import { addPackageToConfig, getInstalledPackages } from '@axway/amplify-registry-sdk';

/**
 * Examples:
 * 	amplify pm use appcd
 * 	amplify pm use appcd@1.0.1
 * 	amplify pm use appcd@latest
 * 	amplify pm use appcd@1.x
 */

export default {
	desc: 'activates a specific package version',
	args: [
		{
			name: 'package',
			hint: 'package[@version]',
			desc: 'the package version or latest to activate',
			required: true
		}
	],
	async action({ argv }) {
		const info = npa(argv.package);
		const { type, name, fetchSpec } = info;
		const installed = getInstalledPackages().filter(pkg => pkg.name === name)[0];

		if (!installed) {
			console.log(`${name} is not installed, please run amplify pm install ${name} first`);
			process.exit(1);
		}

		let version;
		if (type === 'range') {
			version = semver.maxSatisfying(installed.versions, semver.validRange(version));
		} else if (fetchSpec === 'latest') {
			version = semver.maxSatisfying(installed.versions, '*');
		} else if (type === 'version') {
			version = fetchSpec;
		}

		if (!version) {
			console.log('Unsupported');
			process.exit(1);
		}

		if (version && !installed.versions.includes(version)) {
			// TODO: Bikeshed the semantic differences between use and install, whether use should install
			// a package if it is not available and whether install should set a package as in use after install
			console.log(`${version} is not installed, please run "amplify pm install ${name}@${version}" first`);
			process.exit(1);
		}

		const versionInfo = installed.versionInfo[version];
		addPackageToConfig(name, versionInfo.installPath);
		console.log(`Set ${name} to use version ${version}`);
	}
};
