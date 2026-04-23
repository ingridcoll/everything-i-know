# DevOps from Zero to Hero: Build and Deploy a Production API

To get a refresher on DevOps concepts, I'm following this video: [DevOps from Zero to Hero: Build and Deploy a Production API](https://www.youtube.com/watch?v=H5FAxTBuNM8) from JavaScript Mastery.

**Started:** April 22nd, 2026

## Tech Stack & Learning Goals

- [DevOps from Zero to Hero: Build and Deploy a Production API](#devops-from-zero-to-hero-build-and-deploy-a-production-api)
  - [Tech Stack \& Learning Goals](#tech-stack--learning-goals)
  - [Learning Journal](#learning-journal)
    - [Git/GitHub for Version Control (avoids losing your code)](#gitgithub-for-version-control-avoids-losing-your-code)
      - [Setting up Git](#setting-up-git)
      - [Branching and merging](#branching-and-merging)
      - [Adding files to track and committing them locally](#adding-files-to-track-and-committing-them-locally)
      - [To push your local repository to the cloud, use GitHub](#to-push-your-local-repository-to-the-cloud-use-github)
      - [Fetch changes from the remote repository to your local folder](#fetch-changes-from-the-remote-repository-to-your-local-folder)
    - [CI/CD Pipelines (automates builds, tests and deployment)](#cicd-pipelines-automates-builds-tests-and-deployment)
      - [Workflows with GitHub Actions and YAML syntax](#workflows-with-github-actions-and-yaml-syntax)
        - [Sample GitHub Actions workflow that builds and tests an app](#sample-github-actions-workflow-that-builds-and-tests-an-app)
    - [Containerization with Docker (makes code run isolated on any machine/device)](#containerization-with-docker-makes-code-run-isolated-on-any-machinedevice)
      - [Docker images](#docker-images)
      - [Docker containers](#docker-containers)
      - [Docker volume](#docker-volume)
      - [Docker network](#docker-network)
      - [How Docker works in the backend](#how-docker-works-in-the-backend)
      - [The Dockerfile](#the-dockerfile)
        - [Dockerfile syntax](#dockerfile-syntax)
      - [Building an image and starting it in a container](#building-an-image-and-starting-it-in-a-container)
      - [Port mapping](#port-mapping)
      - [Rebuilding the container when the code changes](#rebuilding-the-container-when-the-code-changes)
      - [Docker Compose](#docker-compose)
    - [Kubernetes](#kubernetes)

## Learning Journal

_April 22nd, 2026_

### Git/GitHub for Version Control (avoids losing your code)

Tracks and manages code changes over time.

#### Setting up Git

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

#### Branching and merging

```bash
git branch <branchName> # Creates a new branch
git checkout <branchName> # Switches environment to branch
git checkout -b <branchName> # Creates AND switches to a new branch
git branch <newBranchName> <sourceBranch> # Creates new branch BASED on a specific branch, usually main or develop
```

#### Adding files to track and committing them locally

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

#### To push your local repository to the cloud, use GitHub

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

#### Fetch changes from the remote repository to your local folder

```bash
git pull
```

_April 23rd, 2026_

### CI/CD Pipelines (automates builds, tests and deployment)

Continuous Integration and Continuous Delivery pipelines are sets of automated steps that happen after code is pushed to a repository, up until it's deployed to production.

#### Workflows with GitHub Actions and YAML syntax

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

##### Sample GitHub Actions workflow that builds and tests an app

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

### Containerization with Docker (makes code run isolated on any machine/device)

- Consistency across environments
- Isolation, no dependency conflict
- Portability, easy to move application from dev to prod
- More lightweight than a full Virtual Machine
- Version control
- Easy to scale up or down

#### Docker images

Lightweight, standalone, executable package that includes everything needed to run a piece of software.

- Code
- Runtime
- Libraries
- System tools
- OS

#### Docker containers

Runnable instance of a Docker image. It's the execution environment of an application. A container reads an image, and executes all commands to download packages and run an application. Multiple containers can be run from the same Docker image, making it easy to scale up or down.

#### Docker volume

It's a persistent data storage mechanism that allows data to be shared between a Docker container and the host machine it's running on, or among containers. Ensures data consistency even if one container goes down, since it's like a shared folder outside of the container.

#### Docker network

Communication channel that enables containers to talk to each other or the Internet. Allows containers to share services, while maintaining isolation.

#### How Docker works in the backend

The **Docker client** (`docker`) is the CLI application that lets us use commands to communicate with the Docker daemon (background process). For example, `docker build` instructs the Docker daemon service to start up the Docker container, which then pulls the Docker image and builds the environment needed for the app to run. The docker command uses the Docker API. The Docker client can communicate with more than one daemon. The Docker client and daemon can run on the same system, or you can connect a Docker client to a remote Docker daemon.

The **Docker daemon** (`dockerd`) listens for Docker API requests and manages Docker objects such as images, containers, networks, and volumes. A daemon can also communicate with other daemons to manage Docker services.

A **Docker registry** stores Docker images. Docker Hub is a public registry that anyone can use, and Docker looks for images on Docker Hub by default. You can even run your own private registry. When you use the `docker pull` or `docker run` commands, Docker pulls the required images from your configured registry. When you use the docker push command, Docker pushes your image to your configured registry.

![Docker architecture](https://docs.docker.com/get-started/images/docker-architecture.webp)

**Docker Desktop** is an easy-to-install application for your Mac, Windows, or Linux environment that enables you to build and share containerized applications and microservices. Docker Desktop includes the Docker daemon (`dockerd`), the Docker client (`docker`), Docker Compose, Docker Content Trust, Kubernetes, and Credential Helper.

#### The Dockerfile

To create a Docker image, first create a Dockerfile. It contains instructions telling Docker how to build an image for an application. These instructions run any time the image is built.

##### Dockerfile syntax

- `FROM`: Base image to use.
- `WORKDIR`: Sets the working directory for the instructions to run on.
- `COPY`: Copies local files/folders from the host machine and brings them to the image.
- `RUN`: Executes commands in the shell during image build.
- `EXPOSE`: Informs Docker that the container will listen to specified network ports at runtime.
- `ENV`: Sets environment variables during the build process.
- `ARG`: Defines arguments to pass during the build, easily changed before running the build process.
- `VOLUME`: Creates a mount point for externally mounted volumes. Essentially specifying a location inside your container where you can connect external storage.
- `CMD`: Provides default command to execute when the container starts.
- `ENTRYPOINT`: Specifies the default executable to be run when the container starts.

Both `CMD` and `ENTRYPOINT` are instructions in Docker for defining the default command to run when a container starts. `CMD` is more flexible and can be overridden when running the container while `ENTRYPOINT` defines the main command that cannot be easily overridden.

```yml
FROM node:20-alpine

WORKDIR /app

COPY . .

CMD node hello.ts
```

#### Building an image and starting it in a container

```bash
# To build an image based on a Dockerfile
docker build -t docker-app . # Folder where the Dockerfile is located
# To containerize it, run:
docker run docker-app # docker-app is the image name
# To sh into the container:
docker run -it docker-app sh # docker-app is the image name

# List all containers:
docker ps -a
# Stop a container:
docker stop <dockerContainerID> # Only the first 3 digits of the container ID shown when running docker ps -a
# Stop all containers:
docker container prune
# Remove a container:
docker rm <dockerContainerID> # Only the first 3 digits of the container ID shown when running docker ps -a
```

**Best practice:** In the Dockerfile, it is recommended to create a user first via commands (`RUN addgroup app && adduser -S -G app app`), instead of executing the Dockerfile with the root user.

#### Port mapping

Even though the Dockerfile specifies a port (`EXPOSE`) it's listening to, the host machine does not expose that port by default. To enable it, when building the container, run:

```bash
docker run -p 5173:5173 docker-app # docker-app is the image name, change port number to match Dockerfile
```

If using Vite, you might to also expose the port in its settings. Test this by starting the container and seeing if Vite is exposing the local URL in Network. If not, you have to add the flag `--host` to the `dev` script in the project's `package.json`.

```json
"scripts": {
    "dev": "vite --host"
}
```

Vite should now expose the URL to see the app in the logs when building the container.

#### Rebuilding the container when the code changes

If we make any changes to our local code, the app running in the Docker container won't show them. That's because any time we build the image, all of our code files are copied into the host machine, inside the Docker container.

When building the container, run:

```bash
docker run -p 5173:5173 -v "$(pwd):/app" -v /app/node_modules docker-app
```

- `docker run`: Starts a new container from an image. The image name is the last word in the command (`docker`).
- `-p 5173:5173`: Maps a port using the format `host_port:container_port`. Containers run in network isolation — ports inside a container are invisible to your machine by default. This flag forwards traffic from port 5173 on your laptop to port 5173 inside the container. Without it, you couldn't open `localhost:5173` in your browser and reach the Vite dev server.
- `-v "$(pwd):/app"`: Mounts a volume using the format `host_path:container_path`. `$(pwd)` is a shell command that outputs your current working directory. So if you're in `/home/ingrid/myapp`, this becomes `-v /home/ingrid/myapp:/app`. The container's `/app` directory and your project folder share the same files in real time. You edit a file on your host → the container sees it immediately → Vite hot reload triggers. It's like saying "replace `/app` inside the container with my local folder."
- `-v /app/node_modules`: This second `-v` says "but for `/app/node_modules` specifically, ignore what the host copied in and use a separate Docker-managed folder instead." That separate folder contains the `node_modules` that was built for Linux during `docker build`. If you `npm install` on your Mac, your local `node_modules` has Mac binaries. Mount that into a Linux container and things break. This pattern keeps the Linux-built `node_modules` from the image untouched, isolated from your host folder.

#### Docker Compose

Docker Compose lets you define and run multi-container setups in a single YAML file instead of writing long docker run commands. We can define different services (for example, the app, the database, etc.) in a single file (`docker-compose.yml`), and Docker builds a container for each.

Instead of this:

```bash
docker run -p 5173:5173 -v "$(pwd):/app" -v /app/node_modules my-app
docker run -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres
```

You write a `docker-compose.yml` once:

```yaml
yamlservices:
  app:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
```

Then just run:

```bash
docker compose up
```

Everything starts together, on the same internal network, so your app can reach the database at `db:5432` without any extra config.

### Kubernetes
