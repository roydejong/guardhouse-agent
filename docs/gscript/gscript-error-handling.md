# GScript error handling

GScript is interpreted line-by-line. If an unexpected error occurs during execution, script execution normally halts.

## Error types

### Syntax errors

A syntax error occurs when a line or instruction is broken or malformatted in the script itself.

This is a critical error that cannot be ignored.

Script execution is always aborted when this type of error is encountered, but lines preceding it may have already been executed at that point.

### Soft errors

A soft error occurs when a standalone instruction does not complete successfully. For example:

    package install "bad pkg";
    
    # ...a soft error will now occur, as the package command will fail and return false.
    # (The script may now be aborted depending on the active error mode.)
   
However, blocks (which are if-statements) will never raise an error:

    package install "bad pkg" {
        echo "Package install OK"; # will not happen
    }
    
    # (The script will continue either way, soft error is handled by the block.)
    
If a command is not found or implemented on the current platform, a soft error will be raised.

### Internal errors

An internal error may occur if there is a bug in one of the commands, or a problem with an external component that cannot be handled gracefully.

These types of error should not normally occur, and are treated similarly to syntax errors.

## Error mode

Error mode affects how **soft errors** are handled.

By default, scripts run in the **`normal`** error mode.

The following error modes are supported:

* **`normal`**: All errors are logged and script execution is aborted if a soft error occurs. (*GExecutor.ERROR_MODE_NORMAL*)
* **`continue`**: All errors are logged but execution is never aborted if a soft error occurs. (*GExecutor.ERROR_MODE_CONTINUE*)
