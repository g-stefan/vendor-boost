// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("vendor");

Project.vendor = Project.name + "-" + Project.version;

Shell.mkdirRecursivelyIfNotExists("archive");

// Self
if (Shell.fileExists("archive/" + Project.vendor + ".7z")) {
	if (Shell.getFileSize("archive/" + Project.vendor + ".7z") > 16) {
		return;
	};
	Shell.removeFile("archive/" + Project.vendor + ".7z");
};

var vendorSourceGit = "https://github.com/g-stefan";
if (Shell.hasEnv("VENDOR_SOURCE_GIT")) {
	vendorSourceGit = Shell.getenv("VENDOR_SOURCE_GIT");
};

var vendorSourceAuth = "";
if (Shell.hasEnv("VENDOR_SOURCE_AUTH")) {
	vendorSourceAuth = Shell.getenv("VENDOR_SOURCE_AUTH");
};

exitIf(Shell.system("curl --insecure --location " + vendorSourceGit + "/vendor-" + Project.name + "/releases/download/v" + Project.version + "/" + Project.vendor + ".7z "+vendorSourceAuth+" --output archive/" + Project.vendor + ".7z"));
if (Shell.getFileSize("archive/" + Project.vendor + ".7z") > 32768) {
	return;
};
Shell.removeFile("archive/" + Project.vendor + ".7z");

// Source
runInPath("archive", function() {
	webLink = "https://boostorg.jfrog.io/artifactory/main/release/1.84.0/source/boost_1_84_0.zip";
	if (!Shell.fileExists(Project.vendor + ".zip")) {
		exitIf(Shell.system("curl --insecure --location " + webLink + " --output " + Project.vendor + ".zip"));
	};
	exitIf(Shell.system("7z x " + Project.vendor + ".zip -aoa -o."));
	Shell.removeFile(Project.vendor + ".zip");
	Shell.removeFile(Project.vendor + ".7z");
	Shell.rename("boost_1_84_0","boost-1.84.0");
	exitIf(Shell.system("7z a -mx9 -mmt4 -r- -sse -w. -y -t7z " + Project.vendor + ".7z " + Project.vendor));
	Shell.removeDirRecursivelyForce(Project.vendor);
});
