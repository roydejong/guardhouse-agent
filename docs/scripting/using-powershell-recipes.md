# Using Powershell recipes

Guardhouse supports the use of Powershell scripts for automation on Windows platforms.

## Setup & Requirements

Powershell is automatically supported on Windows platforms that have this feature enabled.

Note: Guardhouse will simply check for the presence of `powershell.exe` on the system to determine whether it is supported.

## Configuration

The top-level **`powershell`** key contains a set of options to configure the Powershell interpreter.

* **`execution_policy`** = `ByPass` (*String*) - Controls which [execution policy](https://docs.microsoft.com/en-us/powershell/module/Microsoft.PowerShell.Security/Set-ExecutionPolicy?view=powershell-6) should be used when running Powershell scripts. 
* **`file_extension`** = `.ps1` (*String*) - The file format to use for Powershell scripts when writing to disk. May affect how Powershell interprets the script text.

## Runtime

Powershell recipes are written to disk as script files, and then executed asynchronously through `powershell.exe` on the local system.

All script output (`stderr` and `stdout`) is monitored and logged.

Once the script exits, the temporary script file will be deleted from disk.