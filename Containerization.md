# Everything I Know About Containerization

**Started:** _April 22nd, 2026_

**Note:** This section compiles different lessons from courses and other learning resources. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

- [DevOps from Zero to Hero: Build and Deploy a Production API - JavaScript Mastery](https://www.youtube.com/watch?v=H5FAxTBuNM8)

**Table of Contents**

- [Everything I Know About Containerization](#everything-i-know-about-containerization)
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
    - [Pods](#pods)
    - [Cluster](#cluster)
    - [ReplicaSet](#replicaset)
    - [Deployment](#deployment)
    - [Service](#service)
    - [ConfigMaps \& Secrets](#configmaps--secrets)
    - [Ingress](#ingress)
    - [Volumes](#volumes)

## Containerization with Docker (makes code run isolated on any machine/device)

- Consistency across environments
- Isolation, no dependency conflict
- Portability, easy to move application from dev to prod
- More lightweight than a full Virtual Machine
- Version control
- Easy to scale up or down

### Docker images

Lightweight, standalone, executable package that includes everything needed to run a piece of software.

- Code
- Runtime
- Libraries
- System tools
- OS

### Docker containers

Runnable instance of a Docker image. It's the execution environment of an application. A container reads an image, and executes all commands to download packages and run an application. Multiple containers can be run from the same Docker image, making it easy to scale up or down.

### Docker volume

It's a persistent data storage mechanism that allows data to be shared between a Docker container and the host machine it's running on, or among containers. Ensures data consistency even if one container goes down, since it's like a shared folder outside of the container.

### Docker network

Communication channel that enables containers to talk to each other or the Internet. Allows containers to share services, while maintaining isolation.

### How Docker works in the backend

The **Docker client** (`docker`) is the CLI application that lets us use commands to communicate with the Docker daemon (background process). For example, `docker build` instructs the Docker daemon service to start up the Docker container, which then pulls the Docker image and builds the environment needed for the app to run. The docker command uses the Docker API. The Docker client can communicate with more than one daemon. The Docker client and daemon can run on the same system, or you can connect a Docker client to a remote Docker daemon.

The **Docker daemon** (`dockerd`) listens for Docker API requests and manages Docker objects such as images, containers, networks, and volumes. A daemon can also communicate with other daemons to manage Docker services.

A **Docker registry** stores Docker images. Docker Hub is a public registry that anyone can use, and Docker looks for images on Docker Hub by default. You can even run your own private registry. When you use the `docker pull` or `docker run` commands, Docker pulls the required images from your configured registry. When you use the docker push command, Docker pushes your image to your configured registry.

![Docker architecture](https://docs.docker.com/get-started/images/docker-architecture.webp)

**Docker Desktop** is an easy-to-install application for your Mac, Windows, or Linux environment that enables you to build and share containerized applications and microservices. Docker Desktop includes the Docker daemon (`dockerd`), the Docker client (`docker`), Docker Compose, Docker Content Trust, Kubernetes, and Credential Helper.

### The Dockerfile

To create a Docker image, first create a Dockerfile. It contains instructions telling Docker how to build an image for an application. These instructions run any time the image is built.

#### Dockerfile syntax

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

### Building an image and starting it in a container

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

### Port mapping

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

### Rebuilding the container when the code changes

If we make any changes to our local code, the app running in the Docker container won't show them. That's because any time we build the image, all of our code files are copied into the host machine, inside the Docker container.

When building the container, run:

```bash
docker run -p 5173:5173 -v "$(pwd):/app" -v /app/node_modules docker-app
```

- `docker run`: Starts a new container from an image. The image name is the last word in the command (`docker`).
- `-p 5173:5173`: Maps a port using the format `host_port:container_port`. Containers run in network isolation — ports inside a container are invisible to your machine by default. This flag forwards traffic from port 5173 on your laptop to port 5173 inside the container. Without it, you couldn't open `localhost:5173` in your browser and reach the Vite dev server.
- `-v "$(pwd):/app"`: Mounts a volume using the format `host_path:container_path`. `$(pwd)` is a shell command that outputs your current working directory. So if you're in `/home/ingrid/myapp`, this becomes `-v /home/ingrid/myapp:/app`. The container's `/app` directory and your project folder share the same files in real time. You edit a file on your host → the container sees it immediately → Vite hot reload triggers. It's like saying "replace `/app` inside the container with my local folder."
- `-v /app/node_modules`: This second `-v` says "but for `/app/node_modules` specifically, ignore what the host copied in and use a separate Docker-managed folder instead." That separate folder contains the `node_modules` that was built for Linux during `docker build`. If you `npm install` on your Mac, your local `node_modules` has Mac binaries. Mount that into a Linux container and things break. This pattern keeps the Linux-built `node_modules` from the image untouched, isolated from your host folder.

### Docker Compose

Docker Compose lets you define and run multi-container setups in a single YAML file instead of writing long docker run commands. We can define different services (for example, the app, the database, etc.) in a single file (`docker-compose.yml`), and Docker builds a container for each.

Instead of this:

```bash
docker run -p 5173:5173 -v "$(pwd):/app" -v /app/node_modules my-app
docker run -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres
```

You write a `docker-compose.yml` once:

```yaml
services:
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

## Kubernetes

A single container has a ceiling. When traffic grows, one container can't handle all the requests. CPU and memory become bottlenecks. Two problems with one container:

- Capacity — it can only handle so much traffic
- Single point of failure — if it crashes, your app goes down

You need multiple copies (replicas) of your container running at the same time, and an automated way to manage them. Kubernetes (abbreviated K8s — 8 letters between K and S) is an open-source container orchestration platform.

Docker gives you containers. Kubernetes decides how, where, and when they run. Kubernetes handles:

- Running your app across multiple machines
- Scaling replicas up and down based on traffic
- Restarting crashed containers automatically
- Distributing traffic evenly across replicas
- Rolling out updates with zero downtime

Without Kubernetes you'd be manually starting/stopping containers, tracking IP addresses, restarting crashes, and scaling by hand.

### Pods

You don't run containers directly in Kubernetes. Containers are wrapped in pods. A pod is the smallest deployable unit in Kubernetes. One container per pod (usually). Each pod gets its own IP address. You interact with pods, not containers directly.

### Cluster

A group of machines (physical or virtual) that work together as one system. Made up of two parts:

- Control Plane: Decides, schedules, and monitors health.
- Worker Nodes: The machines where your containers actually run.

Each worker node runs:

- `kubelet` — an agent that talks to the control plane
- Container runtime — e.g. Docker, runs the containers
- `kube-proxy` — handles networking and routing inside the cluster

### ReplicaSet

Ensures a set number of pods are always running. You declare: "I want 3 replicas" and Kubernetes makes sure 3 pods are always up. If one pod dies, Kubernetes spins up a new one automatically.

### Deployment

A higher-level object that manages ReplicaSets. Lets you define and push updates to your app. Supports rolling updates — replaces old pods gradually so users see no downtime. If a pod crashes, it creates a new one. You describe the desired state. Kubernetes matches it.

### Service

Pods are temporary, they come and go, and each time they get a new IP. A Service solves this. A stable endpoint (permanent IP or DNS name). Automatically routes traffic to available pods. Load balances requests across replicas.

### ConfigMaps & Secrets

Apps need config and credentials. Kubernetes handles this securely.

- ConfigMap — stores non-sensitive config (e.g. database URL)
- Secret — stores sensitive data (e.g. passwords, API keys)

Both are injected into pods without baking them into your Docker image.

### Ingress

Exposes your app to the outside world via HTTP/HTTPS routes. Example: maps `api.myapp.com` → your backend service.

### Volumes

Containers are ephemeral — data is lost if they restart. Kubernetes Volumes provide persistent storage.
