# Writing GScripts

**GScript** (*Guardscript*) is a platform independent scripting engine available in the Guardhouse Agent that can replace native scripts.

It provides a convenient syntax with agent-specific features to quickly automate certain tasks, that are also easy to translate to other platforms.

## Syntax

Each GScript contains a set of instructions. Instructions must be separated with a semicolon (`;`). Usually, for readability, each instruction is placed on a separate line.

### Instructions

A simple instruction consists of an **command**, optionally followed by one or more **arguments**. Here's a simple example:

    package install nginx;
    
Each part of a command is separated by a space.

Each command and each parameter must either be a plain text **single word**, a **string literal**, or a **variable**. These can be used interchangeably throughout.

### Literals

A string literal is wrapped in single quotes (`'`) or double quotes (`"`).

The benefit of literals is that they can also contain spaces within them:

    echo "Hello world, I contain spaces!";
    
You can use the backslash character (`\`) as an **escape character**. The escape character will prevent the character following it being interpreted:

    echo "I can \"escape\" this \"jail\"";
    
### Variables

Variables can be used to store and re-use values.

In the future, they can also be used to inject variables dynamically when running a recipe without having to edit the script.

To define or update a variable from within the script, use the `set` command:

    set pkgName nginx;
    
You can then use the dollar (`$`) character to inject the value of the variable later, for example:

    package install $pkgName;
    
### Comments

Comments must start with a hash (`#`) character. A comment always ends with a newline.

A comment can be placed on a dedicated line, e.g.:

    # Install the package
    package install $pkgName;
    
It can also be placed directly after an instruction:

    echo "hello"; # Say hi to the log
    
### Blocks

Blocks are similar to **if statements**. They look like this:

    package install nginx {
        echo "The package has installed succesfully.";
    }

Each instruction in GScript either returns **true** (1) or **false** (0).

A block will only be entered if the instruction that opens it evaluates to true. If that instruction returns false, the entire block will be skipped instead.

Blocks can be nested within each other.