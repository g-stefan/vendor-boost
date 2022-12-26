// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (Shell.fileExists("temp/build.done.flag")) {
	return;
};

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

runInPath("source",function(){

	Shell.system("cmd.exe /C bootstrap.bat vc142");

	var cmd="b2";
	cmd+=" variant=release";
	cmd+=" link=static";
	cmd+=" threading=multi";
	cmd+=" runtime-link=static";
	cmd+=" architecture=x86";
	cmd+=" -j 16";

	if(Platform.name.indexOf("32")>=0){
		cmd+=" address-model=32";
	} else {
		cmd+=" address-model=64";
	};

	cmd+=" toolset=msvc";
	cmd+=" --layout=system";
	cmd+=" --prefix=\"../output\"";
	cmd+=" --no-cmake-config";
	cmd+=" --build-type=minimal";
	cmd+=" --build-dir=\"temp/boost-build\"";

	cmd+=" install";

	exitIf(Shell.system(cmd));

});

Shell.filePutContents("temp/build.done.flag", "done");

