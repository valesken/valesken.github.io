# A simple python script to load sensitive data and launch my webtask with the appropriate secrets

import json
from subprocess import Popen, PIPE

with open('sensitive.json') as data_file:    
    data = json.load(data_file)

remove_cmd = "sudo wt rm contact"
build_cmd = "sudo wt create --name contact webtask.js -s POSTMARK_SERVER_KEY=%s -s FROM_EMAIL=%s -s TO_EMAIL=%s" % (data["postmark_server_key"], data["from_email"], data["to_email"])

remove_p = Popen(remove_cmd, shell=True, stdout=PIPE, stderr=PIPE)
(stdout, stderr) = remove_p.communicate()
if remove_p.returncode and "No such webtask" not in stderr:
    raise Exception(stderr)
print stdout

build_p = Popen(build_cmd, shell=True, stdout=PIPE, stderr=PIPE)
(stdout, stderr) = build_p.communicate()
if build_p.returncode:
    raise Exception(stderr)
print stdout
