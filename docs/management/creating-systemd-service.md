# Creating a systemd service

The easiest way to run the Guardhouse Agent as a service on most Linux distributions is by setting it up as a **systemd service**.

## Installation

Install the agent as a global package with `npm` if you have not already done so:

    npm install --global guardhouse-agent
    
This will prepare the agent for use, and link the `/usr/bin/guardhouse-agent` binary on the system.

## Configuration

Next, you will need to locate the installation directory for the global package. By default the path is `/usr/lib/node_modules/guardhouse-agent`. We'll use this is a working directory for the service.

Create your configuration file in the `config` directory. The filename of your configuration file must match the `NODE_ENV` used in the service definition later.

For example, you can use the default file as a template (where `live` will be the name of your `NODE_ENV`):

    cp config/default.json config/live.json
    
## Service file

Create the service file `/etc/systemd/service/guardhouse-agent.service`, where `guardhouse-agent` will be the name of the new service.

Fill the contents of the file using the following template:

    [Unit]
    Description=Guardhouse Agent
    
    [Service]
    ExecStart=/usr/bin/guardhouse-agent
    Restart=always
    User=gh-user
    Group=gh-user
    Environment=PATH=/usr/bin:/usr/local/bin
    Environment=NODE_ENV=live
    WorkingDirectory=/usr/lib/node_modules/guardhouse-agent
    
    [Install]
    WantedBy=multi-user.target
    
⚠️ You will need to make sure the `NODE_ENV` value matches that of your configuration file, and that all referenced paths match the ones on your system.

We highly recommend creating a separate user for the guardhouse agent to run under so that you can fine-tune permissions. 

## Service installation

To install and enable the service, enter:

    systemctl enable guardhouse-agent.service
    
You can check the status and recent log output as follows:

    systemctl status guardhouse-agent.service
    
The regular service commands are now available to you:
    
    systemctl start guardhouse-agent.service
    systemctl stop guardhouse-agent.service
    systemctl restart guardhouse-agent.service
    

