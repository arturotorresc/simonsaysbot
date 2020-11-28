windows_zip_file = windows_simonsaysbot.zip
linux_zip_file = linux_simonsaysbot.zip
macos_zip_file = macos_simonsaysbot.zip

extra_files = README.md instructions.txt example.config.toml

package:
	pkg .
	zip $(windows_zip_file) $(extra_files) simon_says_bot-win.exe
	zip $(linux_zip_file) $(extra_files) simon_says_bot-linux
	zip $(macos_zip_file) $(extra_files) simon_says_bot-macos
	ls
