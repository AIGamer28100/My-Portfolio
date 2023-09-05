import requests
import time
import argparse
import webbrowser
 
# Initialize parser
parser = argparse.ArgumentParser()

parser.add_argument("api_token", help = "API Token")

args = parser.parse_args()

# Replace with your PythonAnywhere username and API token
username = "AIGAMER"
api_token = args.api_token
domain_name = "aigamer.pythonanywhere.com"

headers={"Authorization": f'Token {api_token}'}

print("API Token: ", api_token)


host = f"https://www.pythonanywhere.com/api/v0/user/{username}"

response = requests.get(
    f'{host}/cpu/'.format(
        username=username
    ),
    headers=headers
)
if response.status_code == 200:
    print('CPU quota info:')
    print(response.content)
else:
    print('Got unexpected status code {}: {!r}'.format(response.status_code, response.content))

# Create a new bash console
console_response = requests.post(
    f"{host}/consoles/",
    data={
        "executable": "/bin/bash",
        "working_directory": "/home/AIGAMER/aigamer.pythonanywhere.com"
    },
    headers=headers
)

if console_response.status_code == 201:
    print(console_response.json())
    console_id = console_response.json()["id"]
    print(f"New console created. ID: {console_id}")
    
    webbrowser.get("google-chrome").open(f"https://www.pythonanywhere.com/{console_response.json()['console_url']}")

    # Wait for the console to start
    time.sleep(20)
    
    # Get Console Information
    console_info = requests.get(
        f"{host}/consoles/{console_id}/",
        headers=headers
    )
    if console_info.status_code == 200:
        print(f"Console information: {console_info.json()}")
    else:
        print(f"Failed to get console information. Status code: {console_info.status_code}")
        print(f"Response: {console_info.text}")
        
    

    # Run Git commands in the console
    git_commands = [
        "git pull --rebase --autostash",
        # Add more Git commands as needed
    ]

    for command in git_commands:
        command_response = requests.post(
            f"{host}/consoles/{console_id}/send_input/",
            data={"input": command},
            headers=headers
        )

        if command_response.status_code == 200:
            print(f"Command executed successfully: {command}")
            print(f"Response: {command_response.text}")
        else:
            print(f"Status code: {command_response.status_code}")
            print(f"Command failed: {command}")
            print(f"Response: {command_response.text}")

else:
    print("Failed to create a new console.")
    print(f"Status code: {console_response.status_code}")
    
delete_response = requests.delete(
    f"{host}/consoles/{console_id}/",
    headers=headers
)

if delete_response.status_code == 204:
    print("Console deleted successfully.")
else:
    print("Failed to delete the console.")
    print(f"Status code: {delete_response.status_code}")
    
    
# Reload the web app
reload_response = requests.post(
    f"{host}/webapps/{domain_name}/reload/",
    headers=headers
)

if reload_response.status_code == 200:
    print("Web app reloaded successfully.")
else:
    print("Failed to reload the web app.")
    print(f"Status code: {reload_response.status_code}")
    print(f"Response: {reload_response.text}")

