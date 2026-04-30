# Everything I Know About Version Control

**Started:** _April 22nd, 2026_

**Note:** This section compiles different lessons from courses and other learning resources. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

- [DevOps from Zero to Hero: Build and Deploy a Production API - JavaScript Mastery](https://www.youtube.com/watch?v=H5FAxTBuNM8)

**Table of Contents**

- [Everything I Know About Version Control](#everything-i-know-about-version-control)
  - [Git/GitHub for Version Control (avoids losing your code)](#gitgithub-for-version-control-avoids-losing-your-code)
    - [Setting up Git](#setting-up-git)
    - [Branching and merging](#branching-and-merging)
    - [Adding files to track and committing them locally](#adding-files-to-track-and-committing-them-locally)
    - [To push your local repository to the cloud, use GitHub](#to-push-your-local-repository-to-the-cloud-use-github)
    - [Fetch changes from the remote repository to your local folder](#fetch-changes-from-the-remote-repository-to-your-local-folder)
  - [CI/CD Pipelines (automates builds, tests and deployment)](#cicd-pipelines-automates-builds-tests-and-deployment)
    - [Workflows with GitHub Actions and YAML syntax](#workflows-with-github-actions-and-yaml-syntax)
      - [Sample GitHub Actions workflow that builds and tests an app](#sample-github-actions-workflow-that-builds-and-tests-an-app)

## Git/GitHub for Version Control (avoids losing your code)

Tracks and manages code changes over time.

### Setting up Git

```bash
# Install and check it's working
git --version

# Configure name and email (this tracks who made changes to the codebase)
git config --global user.name 'Ingrid'
git config --global user.email 'email@email.com'

# Initialize a repository
git init

# Make sure main branch is named 'main' and not 'master'
git branch -m main
git config --global init.defaultBranch main
```

### Branching and merging

```bash
git branch <branchName> # Creates a new branch
git checkout <branchName> # Switches environment to branch
git checkout -b <branchName> # Creates AND switches to a new branch
git branch <newBranchName> <sourceBranch> # Creates new branch BASED on a specific branch, usually main or develop
```

### Adding files to track and committing them locally

```bash
git status # This will show which files .git is not tracking yet
git add <nameOfFile> # This tells .git to track this one file
git add ./ # This tells .git to track all files in the root folder
git commit -m 'Add file to project' # Takes a snapshot of the project and stores it LOCALLY, commit changes regularly so it's easy to revert if needed, -m stands for message (always write commit messages in imperative, like giving a command, finish the sentence "If applied to the codebase, this commit will _____")
git log # Shows history of commits with commit IDs

# View (not restore) previous version using commit IDs
git checkout <gitID> # Like 1234bd7c5afba1231dw204d1234f86cea40a5

# Restore/rollback to current state (latest, called HEAD)
git checkout -f main
```

### To push your local repository to the cloud, use GitHub

1. Create a repository in GitHub using the UI
2. Back in the IDE's terminal:

```bash
# Link the remote repository to your local folder
git remote add origin <repoURLFromGitHub> # Like https://github.com/ingridcoll/backend-learning.git

# Push changes to the remote repository in GitHub (directly to main, not recommended)
git push -u origin main # -u represents the remote repository's URL

# Publish branch to remote repository
git push --set-upstream origin <localBranch> # Links the local branch to a new remote branch
# If in the same branch, you can run git push all other times, since branch is already linked to cloud
```

### Fetch changes from the remote repository to your local folder

```bash
git pull
```

_April 23rd, 2026_

## CI/CD Pipelines (automates builds, tests and deployment)

Continuous Integration and Continuous Delivery pipelines are sets of automated steps that happen after code is pushed to a repository, up until it's deployed to production.

### Workflows with GitHub Actions and YAML syntax

GitHub Actions are workflows built into GitHub, that live in a `.github/workflows` folder in the repository. Each workflow is a YAML file that describes:

- workflow name (`name:`) - shows up in the UI
- triggers (`on:`) - what event starts the workflow, for example `pull_request`
- jobs (`jobs:`) - set of tasks, each running on its own Virtual Machine,
- OS to use for the job's Virtual Machine (`runs-on`)
- steps (`steps:`) - commands or actions executed in a job, includes shell commands
- pre-built actions (`uses`)
- action parameters (`with`)
- environment variables (`env`)
- job dependencies (`needs`) - makes one job depend on another

YAML is white-space sensitive, indentation matters, and only accepts spaces (no tabs). It consists of key/value pairs, that can form lists (by adding values on new lines preceded by `-`).

[GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)

#### Sample GitHub Actions workflow that builds and tests an app

Sample workflow that builds the application whenever changes are pushed to the `main` branch, installs dependencies and runs the test script:

```yaml
name: Build app on push and run test command

on:
  push:
    branches: [main] # Workflow only triggers when changes are pushed to main branch

jobs:
  build: # Job name, could be anything
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code # Step name, could be anything
        uses: actions/checkout@v5 # Pre-built action. from Github's actions repository

      - name: Set up Node
        uses: actions/setup-node@v6
        with:
          node-version: latest

      - name: Install depenencies
        run: npm install # Runs a comman in the VM

      - name: Run tests
        run: npm test
```

More pre-built actions available in the [marketplace](https://github.com/marketplace?type=actions).
