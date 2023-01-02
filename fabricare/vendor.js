// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
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

Console.writeLn("curl --insecure --location https://github.com/g-stefan/vendor-" + Project.name + "/releases/download/v" + Project.version + "/" + Project.vendor + ".7z --output archive/" + Project.vendor + ".7z");
exitIf(Shell.system("curl --insecure --location https://github.com/g-stefan/vendor-" + Project.name + "/releases/download/v" + Project.version + "/" + Project.vendor + ".7z --output archive/" + Project.vendor + ".7z"));
if (Shell.getFileSize("archive/" + Project.vendor + ".7z") > 16) {
	return;
};
Shell.removeFile("archive/" + Project.vendor + ".7z");

// Source
runInPath("archive", function() {
	webLink = "https://boostorg.jfrog.io/artifactory/main/release/1.81.0/source/boost_1_81_0.zip";
	if (!Shell.fileExists(Project.vendor + ".zip")) {
		exitIf(Shell.system("curl --insecure --location " + webLink + " --output " + Project.vendor + ".zip"));
	};
	exitIf(Shell.system("7z x " + Project.vendor + ".zip -aoa -o."));
	Shell.removeFile(Project.vendor + ".zip");
	Shell.removeFile(Project.vendor + ".7z");
	Shell.rename("boost_1_81_0","boost-1.81.0");
	exitIf(Shell.system("7z a -mx9 -mmt4 -r- -sse -w. -y -t7z " + Project.vendor + ".7z " + Project.vendor));
	Shell.removeDirRecursivelyForce(Project.vendor);
});
