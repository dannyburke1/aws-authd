# aws-authd
Login to AWS, either via an IAM User, An Assumed Role or SSO.


### Purpose of this tool:
The reason for making this, is as a consultant I find myself working with lots of different client AWS accounts, some of which have different ways of authentication. Rather than having one tool I want a central CLI tool I can use for logging into their accounts whether that be assuming a role from a parent organisation, using SSO and assuming a role from there or simply using an IAM user to login.

### Packages:
Initial development has been done in `go version go1.16.1 darwin/amd64`