# Guardhouse Agent

## Introduction

⚡ The Guardhouse Agent is a background daemon for servers and other network-enabled devices that enables remote management. 

The agent communicates with the Guardhouse Service. It is capable of system monitoring as well as performing a variety automatic, scheduled and network-coordinated tasks.

**Please refer to [https://guardhou.se](https://guardhou.se/?utm_source=agent_readme) for more details regarding the Guardhouse service and its features.**

## Requirements

### Environment & OS

🚨 We are currently in an early testing phase, during which support and compatibility is severely limited.

The current version of the agent is tested on and designed to support **Ubuntu 17.04 only**.

*(The agent should work on a variety of platforms and distributions, even on Windows and Mac. However, correct functionality is not guaranteed on other platforms at this time. Linux is recommended regardless.)*

### Dependencies

Node.js and npm are required to install and run the agent:
[https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/)  

## Easy installation

If you are using a supported environment, you can use your normal package manager to install the agent (recommended).

### .deb package (apt-get)

(Coming soon brah!)

## Manual installation

If you are not using a Debian based system, or if you wish to install the agent manually, you can do so via `npm` (not recommended unless you have to). 

### Package installation

To get started, install `guardhouse-agent` as a global package using `npm`:

    npm install --global guardhouse-agent
    
You may need to execute this command as superuser / administrator for it to work correctly.

The agent is normally installed to one the following directories, depending on npm:

    ## For Unix (Linux & Mac)
    /usr/lib/node_modules/guardhouse-agent
    /usr/local/lib/node_modules/guardhouse-agent
    
    ## For Windows
    ~/AppData/Roaming/npm/node_modules/guardhouse-agent
    
You can review the global installation directory for npm using `npm list -g`. 
        
The installation will also register the `guardhouse-agent` binary on your system (`/usr/bin/guardhouse-agent`).

## License

The Guardhouse Agent is available under the GNU GPL v3 License. Please refer to the information included in `LICENSE.md` for additional information.









 